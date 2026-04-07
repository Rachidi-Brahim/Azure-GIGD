const express = require("express");
const fs      = require("fs");
const path    = require("path");

const app  = express();
const PORT = process.env.PORT || 3000;
const FILE = path.join(__dirname, "visits.json");

let lock = false;

function readCounter() {
  try {
    if (!fs.existsSync(FILE)) {
      fs.writeFileSync(FILE, JSON.stringify({ count: 0 }));
    }
    const data = fs.readFileSync(FILE);
    return JSON.parse(data).count;
  } catch (err) {
    console.error("Erreur lecture JSON:", err);
    return 0;
  }
}

function writeCounter(count) {
  try {
    fs.writeFileSync(FILE, JSON.stringify({ count }, null, 2));
  } catch (err) {
    console.error("Erreur écriture JSON:", err);
  }
}

app.get("/", async (req, res) => {
  while (lock) {
    await new Promise(r => setTimeout(r, 10));
  }
  lock = true;
  try {
    let count = readCounter();
    count++;
    writeCounter(count);

    const clientIP =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress;

    res.send(`
      <h2>Compteur de visites</h2>
      <p><strong>Nombre de visites :</strong> ${count}</p>
      <hr>
      
    `);
  } finally {
    lock = false;
  }
});

// Changez la fin de votre index.js
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });