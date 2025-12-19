import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { VehicleEsalData } from '../DesignEsalTable';
import { VehicleType, commonVehicleTypes } from './types';

interface VehicleDataFormProps {
  vehicleData: VehicleEsalData[];
  setVehicleData: (data: VehicleEsalData[]) => void;
}

const VehicleDataForm: React.FC<VehicleDataFormProps> = ({ vehicleData, setVehicleData }) => {
  // ... keep existing code (for state management and handlers)
  const [selectedVehicle, setSelectedVehicle] = useState<string>(commonVehicleTypes[0].name);
  const [percentOfAadt, setPercentOfAadt] = useState<number>(10);
  
  const handleVehicleAdd = () => {
    const vehicleType = commonVehicleTypes.find(v => v.name === selectedVehicle);
    if (!vehicleType) return;
    
    const newVehicle: VehicleEsalData = {
      vehicleClass: selectedVehicle,
      percentOfAadt: percentOfAadt,
      truckFactor: vehicleType.truckFactor,
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
  };
  
  const handleVehicleRemove = (index: number) => {
    const updatedVehicles = [...vehicleData];
    updatedVehicles.splice(index, 1);
    setVehicleData(updatedVehicles);
  };
  
  const totalPercent = vehicleData.reduce((sum, vehicle) => sum + vehicle.percentOfAadt, 0);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Vehicle Data Entry</h3>
      
      <div className="p-3 bg-gray-50 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Percent of AADT (%)</label>
            <input
              type="number"
              value={percentOfAadt}
              onChange={(e) => setPercentOfAadt(parseFloat(e.target.value))}
              min="0.1"
              max="100"
              step="0.1"
              className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm"
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleVehicleAdd}
              className="flex items-center justify-center h-9 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={totalPercent >= 100}
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
                <th className="px-4 py-2 text-left">Truck Factor</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicleData.map((vehicle, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{vehicle.vehicleClass}</td>
                  <td className="px-4 py-2">{vehicle.percentOfAadt}%</td>
                  <td className="px-4 py-2">{vehicle.truckFactor}</td>
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
                <td className="px-4 py-2 font-medium">{totalPercent}%</td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Add the default export
export default VehicleDataForm;