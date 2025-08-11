const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

let db;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const dbName = 'partsDB';
const partsCollectionName = 'parts';
const typesCollectionName = 'part-types';

const initialPartTypes = [
  { name: 'Camera' },
  { name: 'Lidar' },
  { name: 'Computer' },
  { name: 'Sensor' },
  { name: 'Other' }
];

async function connectToDb() {
  await client.connect();
  db = client.db(dbName);
  await initializePartTypes();
  console.log('Successfully connected to MongoDB and initialized types.');
}

async function getDb() {
  if (!db) {
    await connectToDb();
  }
  return db;
}

async function initializePartTypes() {
  const collection = db.collection(typesCollectionName);
  const existingTypes = await collection.countDocuments();
  if (existingTypes === 0) {
    await collection.insertMany(initialPartTypes);
    console.log('Initial part types inserted.');
  }
}

async function getParts(db) {
  const collection = db.collection(partsCollectionName);
  const parts = await collection.find({}).toArray();
  return parts;
}

async function addPart(db, partData) {
  const collection = db.collection(partsCollectionName);
  const newPart = {
    ...partData,
    history: [{ timestamp: new Date(), action: 'Created', details: 'Part created' }]
  };
  const result = await collection.insertOne(newPart);
  return { _id: result.insertedId, ...newPart };
}

async function updatePart(db, id, updatedFields) {
  const collection = db.collection(partsCollectionName);
  const partId = new ObjectId(id);
  const currentPart = await collection.findOne({ _id: partId });
  if (!currentPart) {
    return null;
  }
  const changes = [];
  for (const key in updatedFields) {
    if (updatedFields[key] !== currentPart[key]) {
      changes.push({
        field: key,
        oldValue: currentPart[key],
        newValue: updatedFields[key]
      });
    }
  }
  if (changes.length > 0) {
    const historyEntry = {
      timestamp: new Date(),
      action: 'Updated',
      details: 'Part updated',
      changes: changes
    };
    await collection.updateOne(
      { _id: partId },
      {
        $set: { ...updatedFields },
        $push: { history: historyEntry }
      }
    );
  }
  const updatedDocument = await collection.findOne({ _id: partId });
  return updatedDocument;
}

async function deletePart(db, id) {
  const collection = db.collection(partsCollectionName);
  const partId = new ObjectId(id);
  const result = await collection.deleteOne({ _id: partId });
  return result;
}

async function getPartTypes(db) {
  const collection = db.collection(typesCollectionName);
  const types = await collection.find({}).toArray();
  return types.map(t => t.name);
}

async function addPartType(db, type) {
  const collection = db.collection(typesCollectionName);
  const existingType = await collection.findOne({ name: type });
  if (!existingType) {
    const result = await collection.insertOne({ name: type });
    return { _id: result.insertedId, name: type };
  }
  return existingType;
}

async function deletePartType(db, type) {
  const collection = db.collection(typesCollectionName);
  const result = await collection.deleteOne({ name: type });
  return result;
}

module.exports = {
  connectToDb,
  getDb,
  getParts,
  addPart,
  updatePart,
  deletePart,
  getPartTypes,
  addPartType,
  deletePartType
};
