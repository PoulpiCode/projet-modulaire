import time
from pymongo import MongoClient
from fastapi import FastAPI, UploadFile, File
import pandas as pd
import io

app = FastAPI()

client = MongoClient("mongodb://mongo:27017/", serverSelectionTimeoutMS=5000)
db = client["processus_metier"]
collection = db["csv_data"]

@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    try:
        content = await file.read()
        
        try:
            df = pd.read_csv(io.BytesIO(content), sep=None, engine='python', encoding='utf-8')
        except:
            df = pd.read_csv(io.BytesIO(content), sep=None, engine='python', encoding='latin1')

        df = df.fillna("")
        data = df.to_dict(orient="records")
        
        # On vide et on insère
        collection.delete_many({})
        if data:
            collection.insert_many(data)
            
            # --- LA CORRECTION EST ICI ---
            # MongoDB a ajouté des '_id' dans 'data'. 
            # On les supprime pour que le JSON ne crash pas.
            for row in data:
                if "_id" in row:
                    del row["_id"]

        return {
            "status": "success",
            "message": f"Import de {len(data)} lignes réussi",
            "data": data[:100], 
            "cols": list(df.columns)
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}