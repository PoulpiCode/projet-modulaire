using MongoDB.Driver;
using MongoDB.Bson;
using System;
using System.Threading;

Console.WriteLine("🚀 Démarrage du service d'Audit C#...");

// Connexion à la même instance MongoDB
var client = new MongoClient("mongodb://mongo:27017");
var database = client.GetDatabase("processus_metier");
var collection = database.GetCollection<BsonDocument>("csv_data");

while (true)
{
    try
    {
        var count = collection.CountDocuments(new BsonDocument());
        Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] 📊 Audit SGBD : {count} lignes présentes en base.");
    }
    catch (Exception ex)
    {
        Console.WriteLine("⚠️ Erreur de connexion à MongoDB : " + ex.Message);
    }
    Thread.Sleep(5000); // Vérification toutes les 5 secondes
}