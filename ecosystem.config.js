module.exports = {
  apps: [{
    name: "links",
    script: "npm",
    args: "run preview",
    env: {
      PORT: 3004,
      NODE_ENV: "production"
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}