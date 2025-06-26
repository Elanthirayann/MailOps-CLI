const express = require("express");
const fs = require("fs");

const app = express();

app.get("/track", (req, res) => {
  const email = req.query.email || "Unknown";
  const logEntry = `${new Date().toISOString()} - Opened: ${email}\n`;

  // Log the event
  console.log(logEntry);
  fs.appendFileSync("email-cli.log", logEntry);

  // Send a 1x1 transparent GIF instead of an empty buffer (to avoid email filtering)
  const transparentGif = Buffer.from(
    "R0lGODlhAQABAPAAACAgIP///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
    "base64"
  );

  res.writeHead(200, {
    "Content-Type": "image/gif",
    "Content-Length": transparentGif.length,
  });
  res.end(transparentGif);
});

app.listen(3000, () => console.log("📡 Tracking server running on port 3000"));
