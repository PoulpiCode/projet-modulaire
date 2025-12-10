const importBtn = document.getElementById("importBtn");
const importResult = document.getElementById("importResult");

const logsTableBody = document.querySelector("#logsTable tbody");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

let logs = [];
let currentPage = 0;
const pageSize = 50;

// === Import CSV ===
importBtn.addEventListener("click", async () => {
    importResult.textContent = "Import en cours...";
    try {
        const res = await fetch("/importcsv", { method: "POST" });
        const data = await res.json();
        importResult.textContent = `Import terminé : ${data.imported} logs`;
        await loadLogs();
    } catch (e) {
        importResult.textContent = `Erreur : ${e}`;
    }
});

// === Charger les logs depuis Database via Node ===
async function loadLogs() {
    try {
        const res = await fetch("/logs/all");
        logs = await res.json();
        currentPage = 0;
        renderLogs();
    } catch (e) {
        console.error("Erreur en récupérant les logs", e);
    }
}

// === Affichage paginé ===
function renderLogs() {
    logsTableBody.innerHTML = "";
    const start = currentPage * pageSize;
    const pageLogs = logs.slice(start, start + pageSize);

    pageLogs.forEach((log, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${start + index + 1}</td>
                         <td>${log.timestamp}</td>
                         <td>${log.level}</td>
                         <td>${log.message}</td>`;
        logsTableBody.appendChild(row);
    });

    pageInfo.textContent = `Page ${currentPage + 1} / ${Math.ceil(logs.length / pageSize)}`;
}

// Pagination
prevBtn.addEventListener("click", () => {
    if (currentPage > 0) { currentPage--; renderLogs(); }
});
nextBtn.addEventListener("click", () => {
    if ((currentPage + 1) * pageSize < logs.length) { currentPage++; renderLogs(); }
});

loadLogs();
