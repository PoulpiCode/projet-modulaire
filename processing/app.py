import csv
import requests
from flask import Flask, jsonify
from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)
executor = ThreadPoolExecutor(max_workers=50)  # threads pour accélérer

def send_log(payload):
    try:
        requests.post("http://database:8080/logs/add", json=payload, timeout=2)
    except Exception as e:
        print(f"Erreur en envoyant log: {e}")

@app.route("/importcsv")
def import_csv():
    """Import rapide : seulement Title, Type, Status"""
    try:
        with open("logs.csv", newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            count = 0
            for row in reader:
                message = f"Title: {row.get('Title','')} | Type: {row.get('Type','')} | Status: {row.get('Status','')}"
                payload = {
                    "Timestamp": "",  # inutile pour l'affichage web
                    "Level": row.get("Status", ""),
                    "Message": message
                }
                executor.submit(send_log, payload)
                count += 1
        return jsonify({"status": "ok", "imported": count})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
