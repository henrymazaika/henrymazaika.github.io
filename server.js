const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectToDb, getParts, addPart, updatePart, getPartTypes, addPartType, deletePartType, deletePart, getDb } = require('./api/parts');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Local API server is up and running!');
});

// GET endpoint to fetch all parts
app.get('/api/parts', async (req, res) => {
  try {
    const db = await getDb();
    const parts = await getParts(db);
    res.json(parts);
  } catch (error) {
    console.error('Failed to get parts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST endpoint to add a new part
app.post('/api/parts', async (req, res) => {
  try {
    const db = await getDb();
    const newPartData = req.body;
    const result = await addPart(db, newPartData);
    res.status(201).json(result);
  } catch (error) {
    console.error('Failed to add part:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT endpoint to update a part
app.put('/api/parts/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const updatedFields = req.body;
    const result = await updatePart(db, id, updatedFields);
    if (!result) {
      return res.status(404).json({ error: 'Part not found' });
    }
    res.json(result);
  } catch (error) {
    console.error('Failed to update part:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE endpoint to delete a part
app.delete('/api/parts/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const result = await deletePart(db, id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Part not found' });
    }
    res.status(200).json({ message: 'Part deleted successfully' });
  } catch (error) {
    console.error('Failed to delete part:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET endpoint to fetch all part types
app.get('/api/part-types', async (req, res) => {
  try {
    const db = await getDb();
    const types = await getPartTypes(db);
    res.json(types);
  } catch (error) {
    console.error('Failed to get part types:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST endpoint to add a new part type
app.post('/api/part-types', async (req, res) => {
  try {
    const db = await getDb();
    const { type } = req.body;
    const result = await addPartType(db, type);
    res.status(201).json(result);
  } catch (error) {
    console.error('Failed to add part type:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE endpoint to delete a part type
app.delete('/api/part-types/:type', async (req, res) => {
  try {
    const db = await getDb();
    const { type } = req.params;
    const result = await deletePartType(db, type);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Part type not found' });
    }
    res.status(200).json({ message: 'Part type deleted successfully' });
  } catch (error) {
    console.error('Failed to delete part type:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function startServer() {
  try {
    await connectToDb();
    app.listen(PORT, () => {
      console.log(`Local API server is running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error('Failed to start server:', e);
    process.exit(1);
  }
}

startServer();
