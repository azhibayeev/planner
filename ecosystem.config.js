module.exports = {
  apps: [
    {
      name: 'planner',
      script: 'npm',
      args: 'run start',
      cwd: '/var/www/planner',
      exec_mode: 'fork',
      instances: 1,
      max_memory_restart: '512M',
      min_uptime: '15s',
      max_restarts: 10,
      restart_delay: 2000,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
      out_file: '/root/.pm2/logs/planner-out.log',
      error_file: '/root/.pm2/logs/planner-error.log',
      merge_logs: true,
      time: true,
    },
  ],
}
