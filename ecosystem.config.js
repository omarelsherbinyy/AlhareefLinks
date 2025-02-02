module.exports = {
  apps: [{
    name: "alhareef-links",
    script: "npm",
    args: "run preview",
    env: {
      PORT: 3008,
      NODE_ENV: "production"
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}