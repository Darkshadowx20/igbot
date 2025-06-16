# Instagram Downloader Telegram Bot

A Telegram bot that downloads photos and videos from Instagram posts, reels, and stories.

## Features

- Downloads photos and videos from Instagram posts, reels, and stories
- Supports single photos, videos, and carousels
- Extracts highest quality media
- Tracks user activity and download statistics
- Configurable concurrency limit for downloads
- Proxy support for API requests

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env` file with the following variables:
   ```
   BOT_TOKEN=your_telegram_bot_token
   MONGODB_URI=your_mongodb_connection_string
   CONCURRENCY_LIMIT=5
   
   # Instagram API Configuration
   IG_COOKIE=your_instagram_cookie
   
   # Proxy Configuration (Optional)
   PROXY_HOST=proxy_host
   PROXY_PROTOCOL=http
   PROXY_PORT=port_number
   PROXY_USERNAME=username
   PROXY_PASSWORD=password
   ```
4. Build the project:
   ```bash
   pnpm run build
   ```
5. Start the bot:
   ```bash
   pnpm start
   ```

## Development

To run the bot in development mode:

```bash
pnpm run dev
```

## PM2 Process Management

The bot can be managed using PM2 for better process management and monitoring. The following commands are available:

### Initial Setup
```bash
# Install PM2 globally if not already installed
npm install -g pm2

# Start the bot with PM2
pnpm run ig:start
```

### Available Commands

```bash
# Start the bot
pnpm run ig:start

# Stop the bot
pnpm run ig:stop

# Restart the bot
pnpm run ig:rs

# View logs
pnpm run ig:logs

# Monitor CPU/Memory usage
pnpm run ig:mon
```

### Additional PM2 Commands
```bash
# List all running processes
pm2 list

# Save the current process list
pm2 save

# Set up PM2 to start on system boot
pm2 startup

# Remove PM2 startup script
pm2 unstartup
```

The bot is configured to:
- Auto-restart on crashes
- Watch for file changes in the dist directory
- Log output to the logs directory
- Limit memory usage to 1GB
- Run in development/production environments based on NODE_ENV

## Database Schema

The bot uses MongoDB with the following collections:

- **Users**: Stores user information (ID, username, join date, referrer)
- **ActiveUsers**: Tracks active users and download counts
- **DownloadStats**: Records daily download statistics

## Commands

- `/start`: Start the bot and register as a new user
- Send any Instagram link to download the media

## License

ISC