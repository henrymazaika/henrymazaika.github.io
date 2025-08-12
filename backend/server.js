const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectToDb, getParts, addPart, updatePart, getPartTypes, addPartType, deletePartType, deletePart, getDb } = require('./api/parts');
const { getRobotDesigns, addRobotDesign, updateRobotDesign, deleteRobotDesign, getRobotInstances, addRobotInstance, updateRobotInstance, deleteRobotInstance } = require('./api/robots');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Local API server is up and running!');
});

// Parts API Routes
app.get('/api/parts', async (req, res) => {
    if (req.method === 'OPTIONS') {
    // Handle the preflight request
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins or specify specific origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
    res.status(200).end(); // Respond with 200 OK and terminate the response
  } else {
    try {
        const db = await getDb();
        const parts = await getParts(db);
        res.json(parts);
    } catch (error) {
        console.error('Failed to get parts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
});

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

app.put('/api/parts', async (req, res) => {
    try {
        const db = await getDb();
        const id = req.query.id;
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

app.delete('/api/parts', async (req, res) => {
    try {
        const db = await getDb();
        const id = req.query.id;
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

// Part Types API Routes
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

app.delete('/api/part-types', async (req, res) => {
    try {
        const db = await getDb();
        const type = req.query.type;
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

// Robot Designs API Routes
app.get('/api/robot-designs', async (req, res) => {
    try {
        const db = await getDb();
        const designs = await getRobotDesigns(db);
        res.json(designs);
    } catch (error) {
        console.error('Failed to get robot designs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/robot-designs', async (req, res) => {
    try {
        const db = await getDb();
        const newDesignData = req.body;
        const result = await addRobotDesign(db, newDesignData);
        res.status(201).json(result);
    } catch (error) {
        console.error('Failed to add robot design:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/api/robot-designs', async (req, res) => {
    try {
        const db = await getDb();
        const id = req.query.id;
        const updatedFields = req.body;
        const result = await updateRobotDesign(db, id, updatedFields);
        if (!result) {
            return res.status(404).json({ error: 'Robot design not found' });
        }
        res.json(result);
    } catch (error) {
        console.error('Failed to update robot design:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/robot-designs', async (req, res) => {
    try {
        const db = await getDb();
        const id = req.query.id;
        const result = await deleteRobotDesign(db, id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Robot design not found' });
        }
        res.status(200).json({ message: 'Robot design deleted successfully' });
    } catch (error) {
        console.error('Failed to delete robot design:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Robot Instances API Routes
app.get('/api/robot-instances', async (req, res) => {
    try {
        const db = await getDb();
        const id = req.query.id
        const instances = await getRobotInstances(db, id);
        res.json(instances);
    } catch (error) {
        console.error('Failed to get robot instances:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/robot-instances', async (req, res) => {
    try {
        const db = await getDb();
        const newInstanceData = req.body;
        const result = await addRobotInstance(db, newInstanceData);
        res.status(201).json(result);
    } catch (error) {
        console.error('Failed to add robot instance:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/api/robot-instances', async (req, res) => {
    try {
        const db = await getDb();
        const id = req.query.id;
        const updatedFields = req.body;
        const result = await updateRobotInstance(db, id, updatedFields);
        if (!result) {
            return res.status(404).json({ error: 'Robot instance not found' });
        }
        res.json(result);
    } catch (error) {
        console.error('Failed to update robot instance:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/robot-instances', async (req, res) => {
    try {
        const db = await getDb();
        const id = req.query.id;
        const result = await deleteRobotInstance(db, id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Robot instance not found' });
        }
        res.status(200).json({ message: 'Robot instance deleted successfully' });
    } catch (error) {
        console.error('Failed to delete robot instance:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = app
