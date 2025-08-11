const { getDb } = require('./parts');
const { ObjectId } = require('mongodb');

const designsCollectionName = 'robot-designs';
const instancesCollectionName = 'robot-instances';

// --- Robot Designs ---

/**
 * Fetches all robot designs from the database.
 * @param {object} db - The MongoDB database client.
 * @returns {Promise<Array>} An array of robot design documents.
 */
async function getRobotDesigns(db) {
    const collection = db.collection(designsCollectionName);
    const designs = await collection.find({}).toArray();
    return designs;
}

/**
 * Adds a new robot design to the database.
 * @param {object} db - The MongoDB database client.
 * @param {object} designData - The data for the new robot design.
 * @returns {Promise<object>} The new robot design document with its ObjectId.
 */
async function addRobotDesign(db, designData) {
    const collection = db.collection(designsCollectionName);
    const newDesign = {
        ...designData,
        createdAt: new Date()
    };
    const result = await collection.insertOne(newDesign);
    return { _id: result.insertedId, ...newDesign };
}

/**
 * Updates an existing robot design in the database.
 * @param {object} db - The MongoDB database client.
 * @param {string} id - The ID of the robot design to update.
 * @param {object} updatedFields - The fields to update.
 * @returns {Promise<object|null>} The updated robot design document, or null if not found.
 */
async function updateRobotDesign(db, id, updatedFields) {
    const collection = db.collection(designsCollectionName);
    const designId = new ObjectId(id);
    const result = await collection.findOneAndUpdate(
        { _id: designId },
        { $set: updatedFields },
        { returnDocument: 'after' }
    );
    return result;
}

/**
 * Deletes a robot design from the database.
 * @param {object} db - The MongoDB database client.
 * @param {string} id - The ID of the robot design to delete.
 * @returns {Promise<object>} The result of the deletion operation.
 */
async function deleteRobotDesign(db, id) {
    const collection = db.collection(designsCollectionName);
    const designId = new ObjectId(id);
    const result = await collection.deleteOne({ _id: designId });
    return result;
}

// --- Robot Instances ---

/**
 * Fetches all robot instances from the database.
 * @param {object} db - The MongoDB database client.
 * @returns {Promise<Array>} An array of robot instance documents.
 */
async function getRobotInstances(db) {
    const collection = db.collection(instancesCollectionName);
    const instances = await collection.find({}).toArray();
    return instances;
}

/**
 * Adds a new robot instance to the database.
 * @param {object} db - The MongoDB database client.
 * @param {object} instanceData - The data for the new robot instance.
 * @returns {Promise<object>} The new robot instance document with its ObjectId.
 */
async function addRobotInstance(db, instanceData) {
    const collection = db.collection(instancesCollectionName);
    const newInstance = {
        ...instanceData,
        history: [{ timestamp: new Date(), action: 'Created', details: 'Robot instance created' }]
    };
    const result = await collection.insertOne(newInstance);
    return { _id: result.insertedId, ...newInstance };
}

/**
 * Updates an existing robot instance by adding a new part to its assignedParts array.
 * This uses a single, atomic MongoDB operation to prevent race conditions.
 * @param {object} db - The MongoDB database client.
 * @param {string} id - The ID of the robot instance to update.
 * @param {object} newPartData - The new part object to add to the array.
 * @returns {Promise<object|null>} The updated robot instance document, or null if not found.
 */
async function addPartToRobotInstance(db, id, newPartData) {
    const collection = db.collection(instancesCollectionName);
    const instanceId = new ObjectId(id);

    // Create a history entry for the change
    const historyEntry = {
        timestamp: new Date(),
        action: 'Part Assigned',
        details: `Part with barcode ${newPartData.barcode} added`,
        changes: [{
            field: 'assignedParts',
            oldValue: null, // Since we don't have the old array, we can note this.
            newValue: newPartData
        }]
    };

    // Use $push to add the new part to the array and $push to add the history entry
    const result = await collection.updateOne(
        { _id: instanceId },
        {
            $push: {
                assignedParts: newPartData,
                history: historyEntry
            }
        }
    );

    // If a document was modified, return the updated document
    if (result.modifiedCount > 0) {
        return await collection.findOne({ _id: instanceId });
    }

    return null; // Return null if the instance was not found
}

/**
 * Updates an existing robot instance in the database for general fields.
 * This function now handles everything BUT adding/removing parts.
 * @param {object} db - The MongoDB database client.
 * @param {string} id - The ID of the robot instance to update.
 * @param {object} updatedFields - The fields to update.
 * @returns {Promise<object|null>} The updated robot instance document, or null if not found.
 */
async function updateRobotInstance(db, id, updatedFields) {
    const collection = db.collection(instancesCollectionName);
    const instanceId = new ObjectId(id);
    const currentInstance = await collection.findOne({ _id: instanceId });
    if (!currentInstance) {
        return null;
    }

    // We filter out the 'assignedParts' field from general updates
    const fieldsToUpdate = { ...updatedFields };
    delete fieldsToUpdate.assignedParts;

    const changes = [];
    for (const key in fieldsToUpdate) {
        if (fieldsToUpdate[key] !== currentInstance[key]) {
            changes.push({
                field: key,
                oldValue: currentInstance[key],
                newValue: fieldsToUpdate[key]
            });
        }
    }

    if (changes.length > 0) {
        const historyEntry = {
            timestamp: new Date(),
            action: 'Updated',
            details: 'Robot instance updated',
            changes: changes
        };
        await collection.updateOne(
            { _id: instanceId },
            {
                $set: { ...fieldsToUpdate },
                $push: { history: historyEntry }
            }
        );
    }
    const updatedDocument = await collection.findOne({ _id: instanceId });
    return updatedDocument;
}

/**
 * Deletes a robot instance from the database.
 * @param {object} db - The MongoDB database client.
 * @param {string} id - The ID of the robot instance to delete.
 * @returns {Promise<object>} The result of the deletion operation.
 */
async function deleteRobotInstance(db, id) {
    const collection = db.collection(instancesCollectionName);
    const instanceId = new ObjectId(id);
    const result = await collection.deleteOne({ _id: instanceId });
    return result;
}

module.exports = {
    getRobotDesigns,
    addRobotDesign,
    updateRobotDesign,
    deleteRobotDesign,
    getRobotInstances,
    addRobotInstance,
    updateRobotInstance,
    deleteRobotInstance
};
