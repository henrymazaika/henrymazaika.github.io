import React, { useState, useEffect } from 'react';
import './index.css';

// Base URLs for the API
const API_BASE_URL = 'http://localhost:3001/api';
const PARTS_API_URL = `${API_BASE_URL}/parts`;
const TYPES_API_URL = `${API_BASE_URL}/part-types`;
const ROBOT_DESIGNS_API_URL = `${API_BASE_URL}/robot-designs`;
const ROBOT_INSTANCES_API_URL = `${API_BASE_URL}/robot-instances`;

// Reusable components to avoid a massive return statement
const PartManagement = ({
  parts,
  partTypes,
  partStates,
  selectedPart,
  newPart,
  updateFormData,
  showManageTypes,
  newCustomType,
  showConfirmDelete,
  handleNewPartChange,
  handleUpdateFormChange,
  handleAddPart,
  handleAddType,
  handleDeleteType,
  handleSelectPart,
  handleDeselectPart,
  handleUpdatePart,
  handleDeletePart,
  setShowManageTypes,
  setNewCustomType,
  setShowConfirmDelete,
  message,
  setMessage,
  error,
  loading
}) => (
  <>
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Parts Management</h1>
      <div className="mb-8">
        <form onSubmit={handleAddPart} className="flex flex-col space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Add Part</h2>
          <input type="text" name="barcode" value={newPart.barcode} onChange={handleNewPartChange} placeholder="Barcode" className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select name="type" value={newPart.type} onChange={handleNewPartChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            {partTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <input type="text" name="partVersion" value={newPart.partVersion} onChange={handleNewPartChange} placeholder="Part Version" className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <textarea name="notes" value={newPart.notes} onChange={handleNewPartChange} placeholder="Notes" className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          <select name="state" value={newPart.state} onChange={handleNewPartChange} className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            {partStates.map(state => <option key={state} value={state}>{state}</option>)}
          </select>
          <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500">Add Part</button>
        </form>
        <button type="button" onClick={() => setShowManageTypes(!showManageTypes)} className="w-full mt-4 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400">{showManageTypes ? 'Done Managing Types' : 'Manage Types'}</button>
      </div>
      {showManageTypes && (
        <div className="p-4 bg-gray-50 rounded-lg shadow-inner mb-8">
          <h3 className="font-semibold text-lg text-gray-700 mb-2">Manage Part Types</h3>
          <div className="flex space-x-2 mb-4">
            <input type="text" value={newCustomType} onChange={(e) => setNewCustomType(e.target.value)} placeholder="Enter new type name" className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={() => handleAddType(newCustomType)} className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500">Add New Type</button>
          </div>
          <ul className="space-y-1">
            {partTypes.map(type => (
              <li key={type} className="flex justify-between items-center bg-white p-2 rounded-md border border-gray-200">
                <span>{type}</span>
                <button onClick={() => handleDeleteType(type)} className="text-red-500 hover:text-red-700 font-bold ml-4">Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Parts</h2>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        {loading && <div className="text-gray-500 text-sm text-center">Loading parts...</div>}
        {!loading && parts.length === 0 && !error && (<div className="text-gray-500 text-sm text-center">No parts found. Add one above!</div>)}
        <ul className="space-y-2">
          {parts.map(part => (
            <li key={part._id} className="bg-white p-3 border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-100 transition duration-200 text-center font-semibold text-gray-700" onClick={() => handleSelectPart(part)}>
              <span>{part.barcode} - {part.type}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    {selectedPart && (
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Part Details & History</h2>
        <div className="space-y-4">
          <p className="text-lg"><span className="font-semibold">Barcode:</span> {selectedPart.barcode}</p>
          <p className="text-lg"><span className="font-semibold">Type:</span> {selectedPart.type}</p>
          <p className="text-lg"><span className="font-semibold">Part Version:</span> {selectedPart.partVersion}</p>
          <p className="text-lg"><span className="font-semibold">Notes:</span> {selectedPart.notes}</p>
          <p className="text-lg"><span className="font-semibold">State:</span> {selectedPart.state}</p>
          <h3 className="text-xl font-semibold text-gray-700 mt-6">Update Part</h3>
          <div className="flex flex-col space-y-2">
            <input type="text" name="barcode" value={updateFormData.barcode || ''} onChange={handleUpdateFormChange} placeholder="Barcode" className="px-4 py-2 border border-gray-300 rounded-md" />
            <div className="flex space-x-2">
              <select name="type" value={updateFormData.type || ''} onChange={handleUpdateFormChange} className="flex-grow px-4 py-2 border border-gray-300 rounded-md">
                {partTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <input type="text" name="partVersion" value={updateFormData.partVersion || ''} onChange={handleUpdateFormChange} placeholder="Part Version" className="px-4 py-2 border border-gray-300 rounded-md" />
            <textarea name="notes" value={updateFormData.notes || ''} onChange={handleUpdateFormChange} placeholder="Notes" className="px-4 py-2 border border-gray-300 rounded-md"></textarea>
            <select name="state" value={updateFormData.state || 'Working'} onChange={handleUpdateFormChange} className="px-4 py-2 border border-gray-300 rounded-md">
              {partStates.map(state => <option key={state} value={state}>{state}</option>)}
            </select>
            <button onClick={handleUpdatePart} className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">Save Changes</button>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mt-6">History Log</h3>
          <ul className="space-y-2 text-sm">
            {selectedPart.history.slice().reverse().map((entry, index) => (
              <li key={index} className="bg-gray-50 p-2 rounded-md border border-gray-200">
                <p><strong>{entry.action}</strong> on {new Date(entry.timestamp).toLocaleString()}</p>
                <p>{entry.details}</p>
                {entry.changes && entry.changes.length > 0 && (
                  <ul className="list-disc list-inside mt-1 ml-4">
                    {entry.changes.map((change, cIndex) => (
                      <li key={cIndex}>{change.field}: <strong>{change.oldValue}</strong> {'->'} <strong>{change.newValue}</strong></li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 flex flex-col space-y-2">
          <button className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition duration-300" onClick={() => setShowConfirmDelete(true)}>Delete Part</button>
          <button className="w-full bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300" onClick={handleDeselectPart}>Deselect</button>
        </div>
      </div>
    )}
    {showConfirmDelete && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
          <h3 className="text-xl font-bold text-red-600 mb-4">Confirm Deletion</h3>
          <p className="text-gray-700 mb-6">Are you sure you want to delete part <span className="font-semibold">{selectedPart.barcode}</span>? This action cannot be undone.</p>
          <div className="flex justify-end space-x-4">
            <button onClick={() => setShowConfirmDelete(false)} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300">Cancel</button>
            <button onClick={handleDeletePart} className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition duration-300">Confirm Delete</button>
          </div>
        </div>
      </div>
    )}
  </>
);

const RobotManagement = ({
  robotDesigns,
  robotInstances,
  partTypes,
  parts,
  fetchData,
  message,
  setMessage,
  error,
  loading
}) => {
  const [activeTab, setActiveTab] = useState('designs'); // 'designs' or 'instances'

  // State for creating or editing a robot design
  const [newDesignName, setNewDesignName] = useState('');
  const [newDesignParts, setNewDesignParts] = useState([]);
  const [selectedPartType, setSelectedPartType] = useState(partTypes.length > 0 ? partTypes[0] : '');
  const [partQuantity, setPartQuantity] = useState(1);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [editingDesign, setEditingDesign] = useState(null); // New state for editing
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [assignPartBarcode, setAssignPartBarcode] = useState('');
  const [updateInstanceNotes, setUpdateInstanceNotes] = useState('');
  const [showConfirmDeleteDesign, setShowConfirmDeleteDesign] = useState(false); // New state for design deletion

  // A helper function to reset the form state
  const resetDesignForm = () => {
    setNewDesignName('');
    setNewDesignParts([]);
    setEditingDesign(null);
  };

  // Handle setting up the form for editing
  const handleEditDesign = (design) => {
    setEditingDesign(design);
    setNewDesignName(design.name);
    setNewDesignParts(design.requiredParts);
    setSelectedDesign(null); // Collapse the details panel
  };

  // Handle adding parts to a new design
  const handleAddPartToDesign = () => {
    if (!selectedPartType || partQuantity < 1) return;
    const existingIndex = newDesignParts.findIndex(p => p.type === selectedPartType);
    if (existingIndex > -1) {
      const updatedParts = [...newDesignParts];
      updatedParts[existingIndex].quantity += partQuantity;
      setNewDesignParts(updatedParts);
    } else {
      setNewDesignParts([...newDesignParts, { type: selectedPartType, quantity: partQuantity }]);
    }
    setPartQuantity(1);
  };

  const handleRemovePartFromDesign = (index) => {
    const updatedParts = newDesignParts.filter((_, i) => i !== index);
    setNewDesignParts(updatedParts);
  };

  const handleAddOrUpdateRobotDesign = async (e) => {
    e.preventDefault();
    if (!newDesignName || newDesignParts.length === 0) {
      setMessage("Please enter a design name and add at least one part type.");
      return;
    }
    const method = editingDesign ? 'PUT' : 'POST';
    const url = editingDesign ? `${ROBOT_DESIGNS_API_URL}?id=${editingDesign._id}` : ROBOT_DESIGNS_API_URL;
    const body = { name: newDesignName, requiredParts: newDesignParts };

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const action = editingDesign ? 'updated' : 'created';
      setMessage(`Design '${newDesignName}' ${action} successfully!`);
      resetDesignForm();
      await fetchData();
    } catch (e) {
      console.error(`Failed to ${editingDesign ? 'update' : 'add'} robot design:`, e);
      setMessage(`Failed to ${editingDesign ? 'update' : 'add'} robot design.`);
    }
  };

  const handleDeleteDesign = async () => {
    if (!editingDesign) return;
    try {
      const response = await fetch(`${ROBOT_DESIGNS_API_URL}?id=${editingDesign._id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      setMessage(`Design '${editingDesign.name}' deleted successfully!`);
      resetDesignForm();
      await fetchData();
      setShowConfirmDeleteDesign(false);
    } catch (e) {
      console.error("Failed to delete design:", e);
      setMessage("Failed to delete design. Check your API and try again.");
      setShowConfirmDeleteDesign(false);
    }
  };

  const handleCreateRobotInstance = async (designId) => {
    const randomBarcode = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const design = robotDesigns.find(d => d._id === designId);
    try {
      await fetch(ROBOT_INSTANCES_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcode: randomBarcode,
          designId: designId,
          designName: design.name,
          notes: '',
          assignedParts: [],
        }),
      });
      setMessage(`Instance of '${design.name}' created successfully!`);
      await fetchData();
      setActiveTab('instances');
    } catch (e) {
      console.error("Failed to create robot instance:", e);
      setMessage("Failed to create robot instance.");
    }
  };

  const handleAssignPart = async () => {
    // Check for selected instance and barcode
    if (!selectedInstance || !assignPartBarcode) {
        setMessage("Please select a robot instance and enter a part barcode.");
        return;
    }

    // Find the part to assign (this part of the logic is fine)
    const partToAssign = parts.find(p => p.barcode === assignPartBarcode);
    if (!partToAssign) {
        setMessage(`Part with barcode '${assignPartBarcode}' not found.`);
        return;
    }

    // Find the design for this instance (this is also fine)
    const design = robotDesigns.find(d => d._id === selectedInstance.designId);
    if (!design) {
        setMessage("Robot design not found for this instance.");
        return;
    }

    // Check if the part type is required by the design
    const requiredPart = design.requiredParts.find(req => req.type === partToAssign.type);
    if (!requiredPart) {
        setMessage(`Part type '${partToAssign.type}' is not required by this robot design.`);
        return;
    }

    try {
        // Step 1: GET the most current robot instance data from the database.
        const getResponse = await fetch(`${ROBOT_INSTANCES_API_URL}?id=${selectedInstance._id}`);
        if (!getResponse.ok) {
            throw new Error(`Failed to fetch current robot instance: ${getResponse.status}`);
        }

        const currentInstance = await getResponse.json();

        // Step 2: Use the fresh data for all subsequent checks and logic.
        // Check if the required quantity is already fulfilled using the fresh data.
        const partsOfTypeAssigned = currentInstance.assignedParts.filter(p => p.type === partToAssign.type).length;
        if (partsOfTypeAssigned >= requiredPart.quantity) {
            setMessage(`All required parts of type '${partToAssign.type}' are already assigned.`);
            return;
        }

        // Check if the part is already assigned to this or another robot.
        // We still use the full `robotInstances` state here because it's a global check.
        const isPartAlreadyAssigned = robotInstances.some(instance =>
            instance.assignedParts.some(p => p._id === partToAssign._id)
        );
        if (isPartAlreadyAssigned) {
            setMessage(`Part with barcode '${assignPartBarcode}' is already assigned to a robot.`);
            return;
        }

        // Construct the new assignedParts array using the fresh data from the GET request.
        const updatedAssignedParts = [...currentInstance.assignedParts, {
            _id: partToAssign._id,
            barcode: partToAssign.barcode,
            type: partToAssign.type,
            partVersion: partToAssign.partVersion
        }];

        // Step 3: Send the PUT request with the non-stale data.
        const putResponse = await fetch(`${ROBOT_INSTANCES_API_URL}?id=${currentInstance._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assignedParts: updatedAssignedParts }),
        });

        if (!putResponse.ok) {
            throw new Error(`HTTP error! status: ${putResponse.status}`);
        }

        // Step 4: After a successful update, refresh all data for the UI.
        await fetchData();
        setMessage("Part assigned successfully!");
        setAssignPartBarcode('');
    } catch (e) {
        console.error("Failed to assign part:", e);
        setMessage("Failed to assign part. Check your API and try again.");
    }
};


  const handleUpdateInstanceNotes = async () => {
    if (!selectedInstance || updateInstanceNotes === selectedInstance.notes) return;

    try {
      await fetch(`${ROBOT_INSTANCES_API_URL}?id=${selectedInstance._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: updateInstanceNotes }),
      });

      setMessage("Robot instance notes updated successfully!");
      await fetchData();
    } catch (e) {
      console.error("Failed to update notes:", e);
      setMessage("Failed to update notes.");
    }
  };

  const handleRemovePartFromInstance = async (partId) => {
    if (!selectedInstance) return;

    // Step 1: GET the most current robot instance data from the database.
    const getResponse = await fetch(`${ROBOT_INSTANCES_API_URL}?id=${selectedInstance._id}`);
    if (!getResponse.ok) {
        throw new Error(`Failed to fetch current robot instance: ${getResponse.status}`);
    }

    const currentInstance = await getResponse.json();

    try {
        const updatedAssignedParts = currentInstance.assignedParts.filter(p => p._id !== partId);
        const response = await fetch(`${ROBOT_INSTANCES_API_URL}?id=${selectedInstance._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assignedParts: updatedAssignedParts }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        await fetchData();
        setMessage("Part unassigned successfully!");
    } catch (e) {
        console.error("Failed to remove part:", e);
        setMessage("Failed to remove part from instance.");
    }
  };

  const getRobotStatus = (design, instance) => {
    if (!design) return 'Incomplete';
    const required = design.requiredParts;
    const assigned = instance.assignedParts;
    let isComplete = true;

    for (const req of required) {
      const count = assigned.filter(p => p.type === req.type).length;
      if (count < req.quantity) {
        isComplete = false;
        break;
      }
    }
    return isComplete ? 'Complete' : 'Incomplete';
  };

  const renderDesignDetails = (design) => {
    const instancesOfDesign = robotInstances.filter(i => i.designId === design._id);
    return (
      <div className="bg-white p-4 rounded-lg shadow-inner mt-4">
        <h4 className="font-bold text-gray-800">Design: {design.name}</h4>
        <p className="text-sm text-gray-600">Created: {new Date(design.createdAt).toLocaleDateString()}</p>
        <h5 className="font-semibold mt-2">Required Parts:</h5>
        <ul className="list-disc list-inside ml-4 text-sm">
          {design.requiredParts.map((req, i) => (
            <li key={i}>{req.quantity} x {req.type}</li>
          ))}
        </ul>
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => handleCreateRobotInstance(design._id)}
            className="bg-green-600 text-white text-sm font-bold py-1 px-3 rounded-md hover:bg-green-700 transition duration-300"
          >
            Create Instance
          </button>
        </div>
        <h5 className="font-semibold mt-4">Instances of this Design:</h5>
        {instancesOfDesign.length > 0 ? (
          <ul className="list-disc list-inside ml-4 text-sm">
            {instancesOfDesign.map(instance => (
              <li key={instance._id} className="mt-1">
                <button
                  onClick={() => {
                    setSelectedInstance(instance);
                    setUpdateInstanceNotes(instance.notes);
                    setActiveTab('instances');
                  }}
                  className="text-blue-600 hover:underline"
                >
                  {instance.barcode}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 ml-4">No instances created yet.</p>
        )}
      </div>
    );
  };

  const renderInstanceDetails = (instance) => {
    const design = robotDesigns.find(d => d._id === instance.designId);
    if (!design) return <p>Design not found for this instance.</p>;

    const availableParts = parts.filter(p => p.state === 'Working' && !robotInstances.some(inst => inst.assignedParts.some(ap => ap._id === p._id)));

    const partCounts = instance.assignedParts.reduce((acc, part) => {
      acc[part.type] = (acc[part.type] || 0) + 1;
      return acc;
    }, {});

    return (
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Robot Instance: {instance.barcode}</h2>
          <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getRobotStatus(design, instance) === 'Complete' ? 'bg-green-500' : 'bg-yellow-500'}`}>
            {getRobotStatus(design, instance)}
          </span>
        </div>
        <p className="text-lg mb-2"><span className="font-semibold">Design:</span> {design.name}</p>

        <h3 className="text-xl font-semibold text-gray-700 mt-6">Notes</h3>
        <textarea
          value={updateInstanceNotes}
          onChange={(e) => setUpdateInstanceNotes(e.target.value)}
          onBlur={handleUpdateInstanceNotes}
          placeholder="Add notes for this robot instance..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
        ></textarea>

        <h3 className="text-xl font-semibold text-gray-700 mt-6">Design Requirements</h3>
        <ul className="space-y-2 mt-2">
          {design.requiredParts.map((req, i) => {
            const count = partCounts[req.type] || 0;
            const isFulfilled = count >= req.quantity;
            return (
              <li key={i} className={`flex justify-between items-center p-2 rounded-md ${isFulfilled ? 'bg-green-100' : 'bg-red-100'}`}>
                <span>{req.type}: {count} / {req.quantity} Assigned</span>
                {isFulfilled ? (
                  <span className="text-green-600 font-bold">✔</span>
                ) : (
                  <span className="text-red-600 font-bold">✖</span>
                )}
              </li>
            );
          })}
        </ul>

        <h3 className="text-xl font-semibold text-gray-700 mt-6">Assigned Parts</h3>
        <ul className="space-y-2 mt-2">
          {instance.assignedParts.length > 0 ? (
            instance.assignedParts.map(part => (
              <li key={part._id} className="flex justify-between items-center p-2 bg-gray-50 border rounded-md">
                <span>{part.barcode} ({part.type})</span>
                <button
                  onClick={() => handleRemovePartFromInstance(part._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500">No parts assigned yet.</p>
          )}
        </ul>

        <h3 className="text-xl font-semibold text-gray-700 mt-6">Assign a Part</h3>
        <div className="flex flex-col space-y-2 mt-2">
          <input
            type="text"
            value={assignPartBarcode}
            onChange={(e) => setAssignPartBarcode(e.target.value)}
            placeholder="Enter part barcode to assign"
            className="px-4 py-2 border rounded-md"
          />
          <button
            onClick={handleAssignPart}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Assign Part
          </button>
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mt-6">Available Parts to Assign</h3>
        <ul className="space-y-1 text-sm text-gray-600 mt-2 max-h-48 overflow-y-auto">
          {availableParts.length > 0 ? (
            availableParts.map(part => (
              <li key={part._id} className="bg-gray-50 p-2 rounded-md">
                {part.barcode} ({part.type})
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-500">No available parts to assign.</li>
          )}
        </ul>

        <div className="mt-6 flex justify-end">
          <button onClick={() => setSelectedInstance(null)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300">
            Back to Instances
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Robot Management</h1>
      <div className="flex mb-4 border-b border-gray-200">
        <button onClick={() => setActiveTab('designs')} className={`flex-1 py-2 text-center text-lg font-semibold ${activeTab === 'designs' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Designs</button>
        <button onClick={() => setActiveTab('instances')} className={`flex-1 py-2 text-center text-lg font-semibold ${activeTab === 'instances' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Instances</button>
      </div>

      {activeTab === 'designs' && (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">{editingDesign ? 'Update Robot Design' : 'Create New Robot Design'}</h2>
            <form onSubmit={handleAddOrUpdateRobotDesign} className="flex flex-col space-y-4">
              <input type="text" value={newDesignName} onChange={(e) => setNewDesignName(e.target.value)} placeholder="Enter Design Name (e.g., 'Arm Bot')" className="px-4 py-2 border rounded-md" required />
              <div className="p-4 border rounded-md">
                <h3 className="font-semibold mb-2">Required Parts</h3>
                <div className="flex space-x-2">
                  <select value={selectedPartType} onChange={(e) => setSelectedPartType(e.target.value)} className="flex-grow px-4 py-2 border rounded-md">
                    {partTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                  <input type="number" value={partQuantity} onChange={(e) => setPartQuantity(parseInt(e.target.value, 10))} min="1" className="w-16 px-2 py-2 border rounded-md" />
                  <button type="button" onClick={handleAddPartToDesign} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md">Add</button>
                </div>
                <ul className="mt-4 space-y-2">
                  {newDesignParts.map((part, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded-md">
                      <span>{part.quantity} x {part.type}</span>
                      <button type="button" onClick={() => handleRemovePartFromDesign(index)} className="text-red-500 hover:text-red-700">Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded-md">
                  {editingDesign ? 'Update Design' : 'Create Design'}
                </button>
                {editingDesign && (
                  <button type="button" onClick={resetDesignForm} className="flex-1 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Existing Robot Designs</h2>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {loading && <div className="text-gray-500 text-sm text-center">Loading designs...</div>}
          <ul className="space-y-4">
            {robotDesigns.map(design => (
              <li key={design._id}>
                <div className="w-full text-left font-bold text-gray-800 p-3 bg-gray-200 rounded-md hover:bg-gray-300 flex justify-between items-center">
                  <button onClick={() => setSelectedDesign(selectedDesign?._id === design._id ? null : design)} className="flex-grow text-left">
                    {design.name} ({robotInstances.filter(i => i.designId === design._id).length} instances)
                  </button>
                  <div className="flex space-x-2 ml-4">
                    <button onClick={() => handleEditDesign(design)} className="text-sm bg-yellow-500 text-white font-bold py-1 px-3 rounded-md hover:bg-yellow-600">
                      Edit
                    </button>
                    <button onClick={() => { setEditingDesign(design); setShowConfirmDeleteDesign(true); }} className="text-sm bg-red-500 text-white font-bold py-1 px-3 rounded-md hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                </div>
                {selectedDesign?._id === design._id && renderDesignDetails(design)}
              </li>
            ))}
          </ul>
          {showConfirmDeleteDesign && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h3 className="text-xl font-bold text-red-600 mb-4">Confirm Deletion</h3>
                <p className="text-gray-700 mb-6">Are you sure you want to delete the design <span className="font-semibold">{editingDesign.name}</span>? All robot instances based on this design will become orphans.</p>
                <div className="flex justify-end space-x-4">
                  <button onClick={() => setShowConfirmDeleteDesign(false)} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300">Cancel</button>
                  <button onClick={handleDeleteDesign} className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition duration-300">Confirm Delete</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'instances' && (
        <>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Robot Instances</h2>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {loading && <div className="text-gray-500 text-sm text-center">Loading instances...</div>}
          {robotInstances.length > 0 ? (
            <ul className="space-y-4">
              {robotInstances.map(instance => {
                const design = robotDesigns.find(d => d._id === instance.designId);
                return (
                  <li key={instance._id}>
                    <button
                      onClick={() => {
                        setSelectedInstance(selectedInstance?._id === instance._id ? null : instance);
                        setUpdateInstanceNotes(instance.notes);
                      }}
                      className="w-full text-left p-3 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">{instance.barcode}</span>
                        <span className={`text-sm px-2 py-1 rounded-full text-white ${getRobotStatus(design, instance) === 'Complete' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                          {getRobotStatus(design, instance)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">Design: {design?.name || 'Unknown'}</span>
                    </button>
                    {selectedInstance?._id === instance._id && renderInstanceDetails(instance)}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-gray-500 text-sm text-center">No robot instances found. Create one from a design!</div>
          )}
        </>
      )}
    </div>
  );
};

function App() {
  const [parts, setParts] = useState([]);
  const [partTypes, setPartTypes] = useState([]);
  const [robotDesigns, setRobotDesigns] = useState([]);
  const [robotInstances, setRobotInstances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedTab, setSelectedTab] = useState('parts'); // 'parts' or 'robots'

  // Parts Management State
  const [selectedPart, setSelectedPart] = useState(null);
  const [showManageTypes, setShowManageTypes] = useState(false);
  const [newCustomType, setNewCustomType] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const partStates = ['Working', 'Broken', 'Needs Service'];
  const [newPart, setNewPart] = useState({
    barcode: '',
    type: 'Camera',
    // The part version is now pre-populated
    partVersion: '1.0.0',
    notes: '',
    state: 'Working'
  });
  const [updateFormData, setUpdateFormData] = useState({});

  const generateRandomBarcode = () => Math.floor(1000000000 + Math.random() * 9000000000).toString();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [partsResponse, typesResponse, designsResponse, instancesResponse] = await Promise.all([
        fetch(PARTS_API_URL),
        fetch(TYPES_API_URL),
        fetch(ROBOT_DESIGNS_API_URL),
        fetch(ROBOT_INSTANCES_API_URL)
      ]);

      if (!partsResponse.ok || !typesResponse.ok || !designsResponse.ok || !instancesResponse.ok) {
        throw new Error("Failed to fetch all data.");
      }

      const partsData = await partsResponse.json();
      const typesData = await typesResponse.json();
      const designsData = await designsResponse.json();
      const instancesData = await instancesResponse.json();

      setParts(partsData);
      setPartTypes(typesData);
      setRobotDesigns(designsData);
      setRobotInstances(instancesData);

      setError(null);
    } catch (e) {
      console.error("Failed to fetch data:", e);
      setError("Failed to load data. Please check your API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setNewPart(prev => ({ ...prev, barcode: generateRandomBarcode() }));
  }, []);

  // Part Management Handlers
  const handleNewPartChange = (e) => {
    const { name, value } = e.target;
    setNewPart(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPart = async (e) => {
    e.preventDefault();
    if (!newPart.barcode) {
      setMessage("Please enter a Barcode.");
      return;
    }

    let finalPartType = newPart.type;
    if (newCustomType.trim() !== '') {
      finalPartType = newCustomType.trim();
    }

    try {
      const response = await fetch(PARTS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...newPart, type: finalPartType}),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await fetchData();
      setNewPart({ ...newPart, barcode: generateRandomBarcode(), partVersion: '1.0.0', notes: '', state: 'Working' });
      setNewCustomType('');
      setMessage("Part added successfully!");
    } catch (e) {
      console.error("Failed to add part:", e);
      setMessage("Failed to add part. Check your API and try again.");
    }
  };

  const handleUpdatePart = async () => {
    if (!selectedPart || !updateFormData) return;
    try {
      const response = await fetch(`${PARTS_API_URL}?id=${selectedPart._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateFormData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updatedPart = await response.json();
      setParts(parts.map(part => part._id === updatedPart._id ? updatedPart : part));
      setSelectedPart(updatedPart);
      setMessage("Part updated successfully!");
    } catch (e) {
      console.error("Failed to update part:", e);
      setMessage("Failed to update part. Check your API and try again.");
    }
  };

  const handleAddType = async (type) => {
    try {
      const addTypeResponse = await fetch(TYPES_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      if (!addTypeResponse.ok) throw new Error(`HTTP error! status: ${addTypeResponse.status}`);
      setMessage(`'${type}' added successfully!`);
      await fetchData();
      setNewCustomType('');
    } catch (e) {
      console.error("Failed to add new part type:", e);
      setMessage("Failed to add new part type.");
    }
  };

  const handleDeleteType = async (typeToDelete) => {
    try {
      const response = await fetch(`${TYPES_API_URL}?id=${typeToDelete}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setMessage(`'${typeToDelete}' type deleted successfully!`);
      await fetchData();
    } catch (e) {
      console.error("Failed to delete part type:", e);
      setMessage(`Failed to delete '${typeToDelete}' type.`);
    }
  };

  const handleDeletePart = async () => {
    if (!selectedPart) return;
    try {
      const response = await fetch(`${PARTS_API_URL}?id=${selectedPart._id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setMessage("Part deleted successfully!");
      await fetchData();
      handleDeselectPart();
    } catch (e) {
      console.error("Failed to delete part:", e);
      setMessage("Failed to delete part. Check your API and try again.");
    } finally {
      setShowConfirmDelete(false);
    }
  };

  const handleSelectPart = (part) => {
    setSelectedPart(part);
    setUpdateFormData({
      barcode: part.barcode,
      type: part.type,
      partVersion: part.partVersion,
      notes: part.notes,
      state: part.state
    });
  };

  const handleDeselectPart = () => {
    setSelectedPart(null);
    setShowConfirmDelete(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="bg-white p-2 rounded-lg shadow-xl w-full max-w-md mb-4 flex border-b border-gray-200">
        <button onClick={() => setSelectedTab('parts')} className={`flex-1 py-2 text-center text-lg font-bold ${selectedTab === 'parts' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Parts</button>
        <button onClick={() => setSelectedTab('robots')} className={`flex-1 py-2 text-center text-lg font-bold ${selectedTab === 'robots' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Robots</button>
      </div>

      {selectedTab === 'parts' ? (
        <PartManagement
          parts={parts}
          partTypes={partTypes}
          partStates={partStates}
          selectedPart={selectedPart}
          newPart={newPart}
          updateFormData={updateFormData}
          showManageTypes={showManageTypes}
          newCustomType={newCustomType}
          showConfirmDelete={showConfirmDelete}
          handleNewPartChange={handleNewPartChange}
          handleUpdateFormChange={handleUpdateFormChange}
          handleAddPart={handleAddPart}
          handleAddType={handleAddType}
          handleDeleteType={handleDeleteType}
          handleSelectPart={handleSelectPart}
          handleDeselectPart={handleDeselectPart}
          handleUpdatePart={handleUpdatePart}
          handleDeletePart={handleDeletePart}
          setShowManageTypes={setShowManageTypes}
          setNewCustomType={setNewCustomType}
          setShowConfirmDelete={setShowConfirmDelete}
          message={message}
          setMessage={setMessage}
          error={error}
          loading={loading}
        />
      ) : (
        <RobotManagement
          robotDesigns={robotDesigns}
          robotInstances={robotInstances}
          partTypes={partTypes}
          parts={parts}
          fetchData={fetchData}
          message={message}
          setMessage={setMessage}
          error={error}
          loading={loading}
        />
      )}
      {message && <p className="mt-4 p-2 text-center text-sm text-gray-600">{message}</p>}
    </div>
  );
}

export default App;
