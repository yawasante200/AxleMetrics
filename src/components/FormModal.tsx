import React, { useState } from 'react';
import { CompanyDetails } from '../types/truckFactor';
import { MapPin, User, Building2 } from 'lucide-react';

interface FormModalProps {
  onSubmit: (data: CompanyDetails) => void;
  onClose: () => void;
}

const FormModal: React.FC<FormModalProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<CompanyDetails>({
    company: '',
    address: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    project: '',
    name: '',
    projectLocation: '',
    projectLength: undefined,
    projectLengthUnit: 'km',
    analystName: '',
    inputDataUnit: 'kg'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'projectLength') {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || undefined }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Sync analystName with name field
    const submissionData = {
      ...formData,
      name: formData.analystName || formData.name
    };
    onSubmit(submissionData);
  };

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-center">Fill Details</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
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
                  name="project" 
                  placeholder="Enter project name" 
                  value={formData.project} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Location *</label>
                <input 
                  type="text" 
                  name="projectLocation" 
                  placeholder="Enter project location (e.g., Accra-Kumasi Highway)" 
                  value={formData.projectLocation || ''} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Length</label>
                  <input 
                    type="number" 
                    name="projectLength" 
                    min="0" 
                    step="0.1"
                    placeholder="e.g., 25.5" 
                    value={formData.projectLength || ''} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    name="projectLengthUnit"
                    value={formData.projectLengthUnit || 'km'}
                    onChange={handleChange}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Axle Load Data Unit *</label>
                <p className="text-xs text-gray-500 mb-1">What unit is your CSV axle load data provided in?</p>
                <select
                  name="inputDataUnit"
                  value={formData.inputDataUnit || 'kg'}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="kN">Kilonewtons (kN)</option>
                  <option value="kips">Kips</option>
                </select>
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
                name="analystName" 
                placeholder="Enter analyst or designer name" 
                value={formData.analystName || ''} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  name="company" 
                  placeholder="Enter company name" 
                  value={formData.company} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input 
                  type="text" 
                  name="address" 
                  placeholder="Enter company address" 
                  value={formData.address} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                  type="text" 
                  name="phone" 
                  placeholder="Enter phone number" 
                  value={formData.phone} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button 
              type="button"
              onClick={onClose} 
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;