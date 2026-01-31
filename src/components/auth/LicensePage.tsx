import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Key, Check, Shield } from 'lucide-react';

const LICENSE_STORAGE_KEY = 'axlemetrics_license';

const LicensePage: React.FC = () => {
    const navigate = useNavigate();
    const [licenseKey, setLicenseKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        if (!licenseKey.trim()) {
            setMessage('Please enter a license key');
            setIsSuccess(false);
            return;
        }

        setIsLoading(true);

        // Simulate license validation (mock - always succeeds)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Store license in localStorage
        localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify({
            key: licenseKey,
            activatedAt: new Date().toISOString(),
            isValid: true
        }));

        setIsSuccess(true);
        setMessage('License activated successfully!');

        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => navigate('/'), 1500);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
                {/* Logo */}
                <motion.img
                    src="/src/public/Axle-logo.svg"
                    alt="AxleMetrics"
                    className="h-10 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                />

                {/* License Card */}
                <motion.div
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-md"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    {/* Icon */}
                    <motion.div
                        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <Shield className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Heading */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Activate Your License
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Enter your license key to unlock all features of AxleMetrics.
                        </p>
                    </div>

                    {/* Success State */}
                    {isSuccess ? (
                        <motion.div
                            className="text-center py-6"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <p className="text-green-600 font-medium">{message}</p>
                            <p className="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>
                        </motion.div>
                    ) : (
                        /* Form */
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="XXXX-XXXX-XXXX-XXXX"
                                    value={licenseKey}
                                    onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                                    className="pl-10 font-mono tracking-wider"
                                />
                            </div>

                            {message && !isSuccess && (
                                <motion.p
                                    className="text-red-500 text-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    {message}
                                </motion.p>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                disabled={isLoading}
                            >
                                {isLoading ? 'Validating...' : 'Activate License'}
                            </Button>

                            <p className="text-xs text-center text-gray-400 mt-4">
                                Need a license key? Contact sales@axlemetrics.com
                            </p>
                        </form>
                    )}
                </motion.div>

                {/* Footer Info */}
                <motion.div
                    className="mt-8 text-center text-sm text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <p>© {new Date().getFullYear()} AxleMetrics. All rights reserved.</p>
                </motion.div>
            </div>
        </div>
    );
};

export default LicensePage;
