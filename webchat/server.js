const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

// Get OLLAMA_HOST environment variable, or set a default
const ollamaHost = process.env.OLLAMA_HOST || "http://localhost:11434";

// Serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  // Read the HTML file
  res.sendFile(path.join(__dirname, "public", "index.html"), (err, html) => {
    if (err) {
      res.status(500).send("Error reading HTML file.");
      return;
    }

    // Inject the OLLAMA_HOST value into a script tag
    html = html.replace(
      "</body>",
      `<script>const OLLAMA_HOST = '${ollamaHost}';</script></body>`
    );

    // Send the modified HTML back to the client
    res.send(html);
  });
});

app.listen(port, () => {
  console.log(`Web chat frontend listening at http://localhost:${port}`);
});
