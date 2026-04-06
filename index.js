const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

const FILE = path.join(__dirname, "visits.json");

// Mutex simple (évite écriture concurrente)
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