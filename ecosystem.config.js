module.exports = {
  apps: [{
    name: 'igbot',
    script: './dist/bot.js',
    watch: ['dist'],
    ignore_watch: ['node_modules', 'logs'],
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    instances: 1,
    autorestart: true,
    exec_mode: 'fork',
    node_args: '--experimental-specifier-resolution=node --no-warnings'
  }]
};
