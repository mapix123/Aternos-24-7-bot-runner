const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const mc = require('minecraft-protocol');
const serverHost = 'ServerIpBlaBla.aternos.me';
const serverPort = 69420;
const botUsername = '247_CoolBot';
const reconnectInterval = 1 * 40 * 1000;

let bot = null; // Initialize the bot as null

// Serve static files from current directory (so main.html is accessible)
app.use(express.static(path.join(__dirname)));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'main.html'));
});

io.on('connection', function(socket) {
  console.log('User has connected');

  socket.on('control_bot', function(command) {
    switch (command) {
      case 'start':
        if (!bot) {
          bot = createBot();
          console.log('Bot has turned ON.');
          io.emit('bot_status', 'Bot started.');
        } else {
          console.log('Bot is already running.');
        }
        break;
      case 'stop':
        if (bot) {
          bot.end(); // User requested bot stop
        }
        break;
      case 'reconnect':
        if (bot) {
          bot.end(); // Disconnect the bot before reconnecting
        }
        console.log('Bot Reconnecting..');
        io.emit('bot_status', 'Bot reconnecting...');
        setTimeout(() => {
          bot = createBot(); // Reconnect it after a bit of time
        }, 1000);
        break;
      default:
        console.log('Command Not Found.');
        break;
    }
  });
});

http.listen(3000, function() {
  console.log('Example Bot listening on port 3000!');
});

function createBot() {
  const client = mc.createClient({
    host: serverHost,
    port: serverPort,
    username: botUsername,
  });

  bot = client;

  bot.on('login', () => {
    console.log(`Bot ${bot.username} has logged in!`);
    io.emit('bot_status', `Bot ${bot.username} logged in!`);
  });

  bot.on('end', () => {
    console.log(`Bot ${bot.username} disconnected from the server. Reconnecting in ${reconnectInterval / 1000} seconds.`);
    io.emit('bot_status', `Bot ${bot.username} disconnected from the server. Reconnecting in ${reconnectInterval / 1000} seconds.`);
    handleDisconnection();
  });

  bot.on('error', (err) => {
    console.error(`Bot ${botUsername} encountered an error:`, err);
    handleDisconnection();
  });

  setInterval(() => {
    if (bot && bot.write) {
      try {
        bot.write('keep_alive', { keepAliveId: 4337 });
      } catch (e) {
        // ignore write errors
      }
    }
  }, 10000);

  return bot;
}

function handleDisconnection() {
  bot = null; // Reset bot to null since it's no longer connected
  setTimeout(() => {
    if (!bot) {
      bot = createBot(); // Reconnect the bot after a short delay
    }
  }, reconnectInterval);
}