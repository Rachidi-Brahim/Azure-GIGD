function writeCounter(count) {
    try {
    fs.writeFileSync(FILE, JSON.stringify({ count }, null, 2));
    } catch (err) {
    console.error("Erreur écriture JSON:", err);
    }
    }
    app.get("/", async (req, res) => {
    // Attente si écriture en cours
    while (lock) {
    await new Promise(r => setTimeout(r, 10));
    }
    lock = true;
    try {
    let count = readCounter();
    count++;
    writeCounter(count);
    res.send(`Nombre de visites : ${count}`);
    } finally {
    lock = false;
    }
    });
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });