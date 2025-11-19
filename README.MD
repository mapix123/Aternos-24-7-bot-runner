Aternos Server Bot — Simple Setup Guide
Requirements

Aternos Minecraft server

Replit account

UptimeRobot (free)

Setup
1. Aternos

Create and start your Aternos server.

Copy your server IP.

2. Replit

Make a new Replit project.

Paste your mainfile.js and main.html code into it.

Click Run.

If the bot is working, the Replit console will show a connection message.

3. Copy Webview URL

On the right side of Replit, copy the webview URL.

4. UptimeRobot

Make an account.

Add a new HTTP monitor.

Paste the Replit webview URL.

Create the monitor (this keeps Replit awake).

Config (in index.js)

You can edit:

serverHost – your server IP

serverPort

botUsername

reconnectInterval (time before reconnect)

How it Works

The bot logs into your Aternos server automatically.

Reconnects on its own.

Webpage GUI lets you start / stop / reconnect the bot.


UptimeRobot keeps the bot online 24/7.
