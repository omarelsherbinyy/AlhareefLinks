import Dashboard from "./src/pages/Dashboard.tsx";
import Auth from "./src/pages/Auth.tsx";

const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle client-side routing - send all requests to index.html
app.use("/dashboard", Dashboard);
app.use("/auth", Auth);


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});