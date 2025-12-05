const express = require("express");
const fetch = (...args) => import("node-fetch").then(({default: f}) => f(...args));

const app = express();
app.use(express.urlencoded({ extended: true }));

// Page principale
app.get("/", (req, res) => {
  res.send(`
    <h1>Projet modulaire simple</h1>

    <h2>Envoyer du texte au service Python</h2>
    <form method="POST" action="/process">
      <input name="text" placeholder="Texte..." />
      <button>Envoyer</button>
    </form>

    <h2>Test de la connexion au service C# (Database)</h2>
    <a href="/testdb">Tester Database</a>
  `);
});

// Endpoint pour tester Python
app.post("/process", async (req, res) => {
  const response = await fetch("http://processing:5001/process", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ text: req.body.text })
  });

  const data = await response.json();
  res.send(`<h1>Résultat Python :</h1><pre>${JSON.stringify(data, null, 2)}</pre><a href="/">Retour</a>`);
});

// **NOUVEAU** : endpoint pour tester Database
app.get("/testdb", async (req, res) => {
  try {
    const response = await fetch("http://database:8080/"); // attention au port Database
    const text = await response.text();
    res.send(`<h1>Database response:</h1><pre>${text}</pre><a href="/">Retour</a>`);
  } catch (err) {
    res.send(`<h1>Erreur :</h1><pre>${err}</pre><a href="/">Retour</a>`);
  }
});

app.listen(8080, () => console.log("Web running on 8080"));
