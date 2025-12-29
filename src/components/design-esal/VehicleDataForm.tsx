import React, { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { VehicleEsalData } from '../DesignEsalTable';
import { commonVehicleTypes } from './types';

interface VehicleDataFormProps {
  vehicleData: VehicleEsalData[];
  setVehicleData: (data: VehicleEsalData[]) => void;
}

const CUSTOM_VEHICLE = '__custom__';

const VehicleDataForm: React.FC<VehicleDataFormProps> = ({ vehicleData, setVehicleData }) => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>(commonVehicleTypes[0].name);
  const [percentOfAadt, setPercentOfAadt] = useState<number>(10);
  const [customVehicleName, setCustomVehicleName] = useState<string>('');
  const [customTruckFactor, setCustomTruckFactor] = useState<number>(1.0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTruckFactor, setEditTruckFactor] = useState<number>(0);
  
  const isCustomSelected = selectedVehicle === CUSTOM_VEHICLE;
  
  const handleVehicleAdd = () => {
    let vehicleName: string;
    let truckFactor: number;
    
    if (isCustomSelected) {
      if (!customVehicleName.trim()) {
        alert('Please enter a custom vehicle name');
        return;
      }
      if (customTruckFactor <= 0) {
        alert('Truck factor must be a positive number');
        return;
      }
      vehicleName = customVehicleName.trim();
      truckFactor = customTruckFactor;
    } else {
      const vehicleType = commonVehicleTypes.find(v => v.name === selectedVehicle);
      if (!vehicleType) return;
      vehicleName = vehicleType.name;
      truckFactor = vehicleType.truckFactor;
    }
    
    const newVehicle: VehicleEsalData = {
      vehicleClass: vehicleName,
      percentOfAadt: percentOfAadt,
      truckFactor: truckFactor,
      aadt: 0,
      directionalAadt: 0,
      designLaneAadt: 0,
      growthRate: 0,
      growthFactor: 0,
      yearlyTraffic: 0,
      designEsals: 0
    };
    
    setVehicleData([...vehicleData, newVehicle]);
    // Reset form
    setPercentOfAadt(10);
    if (isCustomSelected) {
      setCustomVehicleName('');
      setCustomTruckFactor(1.0);
    }
  };
  
  const handleVehicleRemove = (index: number) => {
    const updatedVehicles = [...vehicleData];
    updatedVehicles.splice(index, 1);
    setVehicleData(updatedVehicles);
  };

  const handleEditTruckFactor = (index: number) => {
    setEditingIndex(index);
    setEditTruckFactor(vehicleData[index].truckFactor);
  };

  const handleSaveTruckFactor = (index: number) => {
    if (editTruckFactor <= 0) {
      alert('Truck factor must be a positive number');
      return;
    }
    const updatedVehicles = [...vehicleData];
    updatedVehicles[index] = {
      ...updatedVehicles[index],
      truckFactor: editTruckFactor
    };
    setVehicleData(updatedVehicles);
    setEditingIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };
  
  const totalPercent = vehicleData.reduce((sum, vehicle) => sum + vehicle.percentOfAadt, 0);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Vehicle Data Entry</h3>
      
      <div className="p-3 bg-gray-50 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Vehicle Type</label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm"
            >
              {commonVehicleTypes.map((vehicle) => (
                <option key={vehicle.name} value={vehicle.name}>
                  {vehicle.name} (TF: {vehicle.truckFactor})
                </option>
              ))}
              <option value={CUSTOM_VEHICLE}>-- Custom Vehicle --</option>
            </select>
          </div>
          
          {isCustomSelected && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Vehicle Name</label>
                <input
                  type="text"
                  value={customVehicleName}
                  onChange={(e) => setCustomVehicleName(e.target.value)}
                  placeholder="e.g. Custom Truck"
                  className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Truck Factor / ESAL</label>
                <input
                  type="number"
                  value={customTruckFactor}
                  onChange={(e) => setCustomTruckFactor(parseFloat(e.target.value) || 0)}
                  min="0.0001"
                  step="0.0001"
                  className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm"
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">Percent of AADT (%)</label>
            <input
              type="number"
              value={percentOfAadt}
              onChange={(e) => setPercentOfAadt(parseFloat(e.target.value))}
              min="0.1"
              step="0.1"
              className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm"
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleVehicleAdd}
              className="flex items-center justify-center h-9 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <Plus size={16} className="mr-1" /> Add Vehicle
            </button>
          </div>
        </div>
      </div>
      
      {totalPercent > 100 && (
        <div className="text-red-500 text-sm">
          Warning: Total percentage exceeds 100% ({totalPercent.toFixed(1)}%)
        </div>
      )}
      
      {vehicleData.length > 0 && (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Vehicle Class</th>
                <th className="px-4 py-2 text-left">Percent of AADT</th>
                <th className="px-4 py-2 text-left">Truck Factor / ESAL</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicleData.map((vehicle, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{vehicle.vehicleClass}</td>
                  <td className="px-4 py-2">{vehicle.percentOfAadt}%</td>
                  <td className="px-4 py-2">
                    {editingIndex === index ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={editTruckFactor}
                          onChange={(e) => setEditTruckFactor(parseFloat(e.target.value) || 0)}
                          min="0.0001"
                          step="0.0001"
                          className="w-24 h-7 rounded border border-gray-300 px-2 text-sm"
                        />
                        <button
                          onClick={() => handleSaveTruckFactor(index)}
                          className="text-green-600 hover:text-green-800 text-xs px-2 py-1 bg-green-50 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-800 text-xs px-2 py-1 bg-gray-50 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{vehicle.truckFactor}</span>
                        <button
                          onClick={() => handleEditTruckFactor(index)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit truck factor"
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleVehicleRemove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 border-t">
                <td className="px-4 py-2 font-medium">Total</td>
                <td className="px-4 py-2 font-medium">{totalPercent.toFixed(1)}%</td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VehicleDataForm;