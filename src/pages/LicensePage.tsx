import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Unlock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LicensePage = () => {
    const navigate = useNavigate();
    const { activateLicense, logout } = useAuth();
    const [licenseKey, setLicenseKey] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (activateLicense(licenseKey)) {
            navigate('/');
        } else {
            setError('Invalid license key. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Key className="h-6 w-6 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Product Activation
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Please enter your license key to continue using AxleMetrics
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="licenseKey" className="block text-sm font-medium text-gray-700">
                                License Key
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <ShieldCheck className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="licenseKey"
                                    id="licenseKey"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3"
                                    placeholder="XXXX-XXXX-XXXX-XXXX"
                                    value={licenseKey}
                                    onChange={(e) => setLicenseKey(e.target.value)}
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                                Enter any non-empty string as a dummy license key.
                            </p>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                <Unlock className="w-4 h-4 mr-2" />
                                Activate License
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Need to switch accounts?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={logout}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LicensePage;
