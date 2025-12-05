import csv
import requests
from flask import Flask, jsonify
from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)
executor = ThreadPoolExecutor(max_workers=10)  # 10 threads simultanés

def send_log(payload):
    try:
        requests.post("http://database:8080/logs/add", json=payload, timeout=1)
    except:
        pass

@app.route("/importcsv")
def import_csv():
    try:
        with open("logs.csv", newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            count = 0
            for i, row in enumerate(reader):
                if i >= 20:  # test 20 lignes
                    break
                payload = {
                    "Timestamp": row.get("Migration start time", ""),
                    "Level": row.get("Status", ""),
                    "Message": row.get("Title", "")
                }
                executor.submit(send_log, payload)  # envoi async
                count += 1
        return jsonify({"status": "ok", "imported": count})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
