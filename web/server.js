const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = 8080;

app.use(express.static(__dirname)); // Pour style.css

// Redirection de / vers /logs/all-web
app.get("/", (req, res) => {
    res.redirect("/logs/all-web");
});

app.get("/logs/all-web", async (req, res) => {
    try {
        const response = await fetch("http://database:8080/logs/all");
        const logs = await response.json();

        // Affiche juste Title, Type et Status
        let tableRows = logs.map((log, i) => {
            return `<tr>
                        <td>${i+1}</td>
                        <td>${log.message || ""}</td>
                    </tr>`;
        }).join("");

        const html = `
            <html>
            <head>
                <link rel="stylesheet" href="style.css">
                <title>Logs</title>
            </head>
            <body>
                <h1>Logs Import CSV</h1>
                <button onclick="importCSV()">Importer CSV</button>

                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Infos (Title | Type | Status)</th>
                        </tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                </table>

                <script>
                    async function importCSV() {
                        const res = await fetch("http://localhost:5001/importcsv");
                        const data = await res.json();
                        alert('Import terminé: ' + data.imported + ' lignes');
                        location.reload();
                    }
                </script>
            </body>
            </html>
        `;
        res.send(html);
    } catch (e) {
        res.send("Erreur: " + e.message);
    }
});

app.listen(PORT, () => console.log(`Web serveur sur http://localhost:${PORT}`));
