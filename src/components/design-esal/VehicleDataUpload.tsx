import React, { useRef } from 'react';
import { VehicleEsalData } from '../DesignEsalTable';
import { FileDown, UploadCloud } from 'lucide-react';
import { createTemplateFile } from './utils';

interface VehicleDataUploadProps {
  vehicleData: VehicleEsalData[];
  onVehicleDataUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const VehicleDataUpload: React.FC<VehicleDataUploadProps> = ({ 
  vehicleData, 
  onVehicleDataUpload 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">1. Upload Vehicle Data</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <button 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white shadow-sm hover:bg-gray-100 h-9 px-4 py-2"
            onClick={() => createTemplateFile('vehicle')}
            type="button"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Download Template
          </button>
          <button 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white shadow-sm hover:bg-gray-100 h-9 px-4 py-2"
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <UploadCloud className="mr-2 h-4 w-4" />
            Upload Vehicle Data
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={onVehicleDataUpload}
            className="hidden"
          />
        </div>
        {vehicleData.length > 0 && (
          <p className="text-sm text-green-600">
            ✓ {vehicleData.length} vehicle classes loaded
          </p>
        )}
      </div>
    </div>
  );
};

export default VehicleDataUpload;