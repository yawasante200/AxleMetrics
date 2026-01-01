import React, { useState } from 'react';
import { X, Building2, MapPin, User } from 'lucide-react';
import { CompanyDetails } from '../../types/truckFactor';

interface CompanyDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: CompanyDetails) => void;
  initialDetails?: CompanyDetails;
}

const CompanyDetailsDialog: React.FC<CompanyDetailsDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDetails
}) => {
  const [details, setDetails] = useState<CompanyDetails>(
    initialDetails || {
      company: '',
      address: '',
      phone: '',
      date: new Date().toLocaleDateString(),
      project: '',
      name: '',
      projectLocation: '',
      projectLength: undefined,
      projectLengthUnit: 'km',
      analystName: ''
    }
  );

  const handleSave = () => {
    onSave(details);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Project & Company Details</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Project Information Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b">
              <MapPin className="h-4 w-4 text-green-600" />
              <h3 className="font-semibold text-gray-700">Project Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  value={details.project}
                  onChange={(e) => setDetails({ ...details, project: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Location *</label>
                <input
                  type="text"
                  value={details.projectLocation || ''}
                  onChange={(e) => setDetails({ ...details, projectLocation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project location (e.g., Accra-Kumasi Highway)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Length</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={details.projectLength || ''}
                    onChange={(e) => setDetails({ ...details, projectLength: parseFloat(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 25.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    value={details.projectLengthUnit || 'km'}
                    onChange={(e) => setDetails({ ...details, projectLengthUnit: e.target.value as 'km' | 'miles' | 'feet' | 'meters' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="km">Kilometers (km)</option>
                    <option value="miles">Miles</option>
                    <option value="meters">Meters</option>
                    <option value="feet">Feet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={details.date}
                  onChange={(e) => setDetails({ ...details, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Analyst/Designer Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b">
              <User className="h-4 w-4 text-purple-600" />
              <h3 className="font-semibold text-gray-700">Analyst/Designer</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Analyst/Designer Name *</label>
              <input
                type="text"
                value={details.analystName || details.name}
                onChange={(e) => setDetails({ ...details, analystName: e.target.value, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter analyst or designer name"
              />
            </div>
          </div>

          {/* Company Information Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b">
              <Building2 className="h-4 w-4 text-blue-600" />
              <h3 className="font-semibold text-gray-700">Company Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={details.company}
                  onChange={(e) => setDetails({ ...details, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter company name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={details.address}
                  onChange={(e) => setDetails({ ...details, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter company address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={details.phone}
                  onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 p-6 border-t sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsDialog;