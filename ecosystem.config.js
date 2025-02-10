module.exports = {
    apps: [
      {
        name: "links",
        script: "npx",
        args: "vite preview",
        env: {
          PORT: 3008, // Change to your preferred port
          NODE_ENV: "production",
        },
      },
    ],
  };
  