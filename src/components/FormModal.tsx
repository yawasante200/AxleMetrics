import React, { useState } from 'react';
import { CompanyDetails } from '../types/truckFactor';

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
    name: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className='flex flex-col items-center p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors cursor-pointer'>
        <div className="modal">
          <h2 className="text-xl font-bold">Fill Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4 space-x-5 flex-2 border-gray-300">
            <input type="text" name="company" className='ml-4' placeholder="Company" value={formData.company} onChange={handleChange} required />
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
            <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
            <input type="date" name="date" placeholder="Date" value={formData.date} onChange={handleChange} required />
            <input type="text" name="project" placeholder="Project" value={formData.project} onChange={handleChange} required />
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <button type="submit" className="btn-submit px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">Submit</button>
          </form>
          <button onClick={onClose} className="btn-close w-full mt-8 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 bg-red-300 text-red-700 font-bold focus:border-blue-500">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default FormModal;