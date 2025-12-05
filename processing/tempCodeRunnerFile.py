from flask import Flask, request, jsonify

app = Flask(__name__)

@app.post("/process")
def process():
    text = request.json.get("text", "")
    return jsonify({
        "original": text,
        "processed": text.upper()
    })

app.run(host="0.0.0.0", port=5001)
