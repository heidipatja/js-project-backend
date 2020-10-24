const mongo = require("mongodb").MongoClient;
const dsn = "mongodb://localhost:27017/trading";

const fs = require("fs");
const path = require("path");
const docs = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "reset.json"),
    "utf8"
));

resetCollection(dsn, "users", docs)
    .catch(err => console.log(err));

async function resetCollection(dsn, collection, doc) {
    const client  = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(collection);

    await col.deleteMany();
    await col.insertMany(doc);

    await client.close();
}
