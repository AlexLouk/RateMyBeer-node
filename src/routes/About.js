const express = require('express');
const router = express.Router();

// Array zum Speichern der About-Einträge (als Beispiel)
let aboutEntries = [];

// Middleware zum Parsen von JSON-Daten
router.use(express.json());

// Endpunkt zum Speichern des Abouts
router.post('/saveAbout', (req, res) => {
  const { about } = req.body;

  // Füge das About dem Array hinzu
  aboutEntries.push(about);
  console.log(aboutEntries[0]);

  // Annahme: Das About wurde erfolgreich gespeichert
  const savedAbout = {
    message: 'About erfolgreich gespeichert.',
    about,
  };

  res.json(savedAbout);
});

router.get('/getAbout', (req, res) => {
  if (aboutEntries.length > 0) {
    const about = aboutEntries[aboutEntries.length - 1];
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(about);
  } else {
    res.status(404).json({ message: 'About nicht gefunden.' });
  }
});

module.exports = router;
