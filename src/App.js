import React, { useState, useEffect } from 'react';
import './index.css';

// The base URL for your API. It's crucial to include the port number.
const API_URL = 'http://localhost:3001/api/parts';
const TYPES_API_URL = 'http://localhost:3001/api/part-types';

function App() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedPart, setSelectedPart] = useState(null);
  const [showManageTypes, setShowManageTypes] = useState(false);
  const [newCustomType, setNewCustomType] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // State for the new part form
  const [newPart, setNewPart] = useState({
    barcode: '',
    type: 'Camera',
    partVersion: '',
    notes: '',
    state: 'Working'
  });

  // State for updating a part
  const [updateFormData, setUpdateFormData] = useState({});

  // State for persistent part types
  const [partTypes, setPartTypes] = useState([]);
  const partStates = ['Working', 'Broken', 'Needs Service'];

  // Function to generate a random integer for the barcode
  const generateRandomBarcode = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  };

  // Function to fetch parts and part types from the API
  const fetchData = async () => {
    setLoading(true);
    try {
      const partsResponse = await fetch(API_URL);
      if (!partsResponse.ok) {
        throw new Error(`HTTP error! status: ${partsResponse.status}`);
      }
      const partsData = await partsResponse.json();
      setParts(partsData);

      const typesResponse = await fetch(TYPES_API_URL);
      if (!typesResponse.ok) {
        throw new Error(`HTTP error! status: ${typesResponse.status}`);
      }
      const typesData = await typesResponse.json();
      setPartTypes(typesData);

      setError(null);
    } catch (e) {
      console.error("Failed to fetch data:", e);
      setError("Failed to load data. Please check your API.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data and generate a random barcode when the component mounts
  useEffect(() => {
    fetchData();
    setNewPart(prev => ({ ...prev, barcode: generateRandomBarcode() }));
  }, []);

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

    // Logic to handle new custom part type
    let finalPartType = newPart.type;
    // This is a legacy check in case the user types in the Manage Types section
    // but doesn't explicitly save it before adding a part.
    if (newCustomType.trim() !== '') {
      finalPartType = newCustomType.trim();
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...newPart, type: finalPartType}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchData();
      setNewPart({ ...newPart, barcode: generateRandomBarcode(), partVersion: '', notes: '', state: 'Working' });
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
      const response = await fetch(`${API_URL}/${selectedPart._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateFormData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });
      if (!addTypeResponse.ok) {
        throw new Error(`HTTP error! status: ${addTypeResponse.status}`);
      }
      setMessage(`'${type}' added successfully!`);
      await fetchData(); // Refetch types to get the new one
      setNewCustomType(''); // Clear input after adding
    } catch (e) {
      console.error("Failed to add new part type:", e);
      setMessage("Failed to add new part type.");
    }
  };

  const handleDeleteType = async (typeToDelete) => {
    try {
      const response = await fetch(`${TYPES_API_URL}/${typeToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setMessage(`'${typeToDelete}' type deleted successfully!`);
      await fetchData(); // Refetch all data to update the UI
    } catch (e) {
      console.error("Failed to delete part type:", e);
      setMessage(`Failed to delete '${typeToDelete}' type.`);
    }
  };

  const handleDeletePart = async () => {
    if (!selectedPart) return;

    try {
      const response = await fetch(`${API_URL}/${selectedPart._id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setMessage("Part deleted successfully!");
      // Refetch all parts and deselect the current one
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
    // Initialize update form with current part data
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Parts Management</h1>

        <div className="mb-8">
          <form onSubmit={handleAddPart} className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Add Part</h2>

            <input type="text" name="barcode" value={newPart.barcode} onChange={handleNewPartChange} placeholder="Barcode (e.g. 12345ABC)" className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

            <select name="type" value={newPart.type} onChange={handleNewPartChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              {partTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>

            <input type="text" name="partVersion" value={newPart.partVersion} onChange={handleNewPartChange} placeholder="Part Version (e.g. 1.0.1)" className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

            <textarea name="notes" value={newPart.notes} onChange={handleNewPartChange} placeholder="Notes" className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>

            <select name="state" value={newPart.state} onChange={handleNewPartChange} className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              {partStates.map(state => <option key={state} value={state}>{state}</option>)}
            </select>

            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Add Part
            </button>
            {message && <p className="text-sm text-green-600 mt-2 text-center">{message}</p>}
          </form>

          <button type="button" onClick={() => setShowManageTypes(!showManageTypes)} className="w-full mt-4 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
            {showManageTypes ? 'Done Managing Types' : 'Manage Types'}
          </button>
        </div>

        {showManageTypes && (
          <div className="p-4 bg-gray-50 rounded-lg shadow-inner mb-8">
            <h3 className="font-semibold text-lg text-gray-700 mb-2">Manage Part Types</h3>
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newCustomType}
                onChange={(e) => setNewCustomType(e.target.value)}
                placeholder="Enter new type name"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleAddType(newCustomType)}
                className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Add New Type
              </button>
            </div>
            <ul className="space-y-1">
              {partTypes.map(type => (
                <li key={type} className="flex justify-between items-center bg-white p-2 rounded-md border border-gray-200">
                  <span>{type}</span>
                  <button onClick={() => handleDeleteType(type)} className="text-red-500 hover:text-red-700 font-bold ml-4">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Parts</h2>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {loading && <div className="text-gray-500 text-sm text-center">Loading parts...</div>}
          {!loading && parts.length === 0 && !error && (
            <div className="text-gray-500 text-sm text-center">No parts found. Add one above!</div>
          )}
          <ul className="space-y-2">
            {parts.map(part => (
              <li
                key={part._id}
                className="bg-white p-3 border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-100 transition duration-200 text-center font-semibold text-gray-700"
                onClick={() => handleSelectPart(part)}
              >
                <span>{part.barcode} - {part.type}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Conditional rendering for the interactive menu */}
      {selectedPart && (
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Part Details & History</h2>
          <div className="space-y-4">
            <p className="text-lg">
              <span className="font-semibold">Barcode:</span> {selectedPart.barcode}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Type:</span> {selectedPart.type}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Part Version:</span> {selectedPart.partVersion}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Notes:</span> {selectedPart.notes}
            </p>
            <p className="text-lg">
              <span className="font-semibold">State:</span> {selectedPart.state}
            </p>

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
              <button
                onClick={handleUpdatePart}
                className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
              >
                Save Changes
              </button>
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
                        <li key={cIndex}>
                          {change.field}: <strong>{change.oldValue}</strong> {'->'} <strong>{change.newValue}</strong>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

          </div>
          <div className="mt-6 flex flex-col space-y-2">
            <button
              className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
              onClick={() => setShowConfirmDelete(true)}
            >
              Delete Part
            </button>
            <button
              className="w-full bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300"
              onClick={handleDeselectPart}
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h3 className="text-xl font-bold text-red-600 mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">Are you sure you want to delete part <span className="font-semibold">{selectedPart.barcode}</span>? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePart}
                className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
