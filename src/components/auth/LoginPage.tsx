import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await authService.login({ email, password });
            if (response.success && response.user) {
                // Update auth context with user data
                login(response.user);
                navigate('/');
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Illustration */}
            <motion.div
                className="hidden lg:flex lg:w-1/2 bg-white flex-col justify-between p-8"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                {/* Logo */}
                <div>
                    <img
                        src="/src/public/Axle-logo.svg"
                        alt="AxleMetrics"
                        className="h-8"
                    />
                </div>

                {/* Truck Chassis Illustration */}
                <motion.div
                    className="flex-1 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <img
                        src="/src/public/truck-chassis.png"
                        alt="Truck Chassis"
                        className="max-w-full h-auto max-h-[400px] object-contain"
                    />
                </motion.div>

                {/* Tagline */}
                <motion.div
                    className="pb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <p className="text-gray-500 text-sm mb-2">
                        Pavement Traffic Load & ESAL Analysis Software.
                    </p>
                    <div className="border-t border-dashed border-gray-300 my-3"></div>
                    <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                        Unparalleled Accuracy For<br />
                        All Your Pavement Designs.
                    </h2>
                </motion.div>
            </motion.div>

            {/* Right Panel - Login Form */}
            <motion.div
                className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8">
                        <img
                            src="/src/public/Axle-logo.svg"
                            alt="AxleMetrics"
                            className="h-8 mx-auto"
                        />
                    </div>

                    <motion.h1
                        className="text-2xl font-bold text-gray-900 mb-8"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        Login Into Your Account
                    </motion.h1>

                    <motion.form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {error && (
                            <motion.p
                                className="text-red-500 text-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {error}
                            </motion.p>
                        )}

                        <div className="text-right">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </motion.form>

                    {/* Divider */}
                    <motion.div
                        className="flex items-center my-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-gray-500 text-sm">Or</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </motion.div>

                    {/* Google Sign In */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Button
                            type="button"
                            variant="outline"
                            fullWidth
                            onClick={() => console.log('Google Sign In')}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span>Sign In With Google</span>
                            </div>
                        </Button>
                    </motion.div>

                    {/* Sign Up Link */}
                    <motion.div
                        className="mt-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <span className="text-gray-600">Don't have an account? </span>
                        <Link
                            to="/signup"
                            className="font-semibold text-gray-900 hover:text-blue-500 transition-colors inline-flex items-center gap-1"
                        >
                            Create One Now
                            <span className="text-lg">→</span>
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
