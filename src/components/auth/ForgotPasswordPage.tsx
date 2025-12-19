import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { authService } from '../../services/authService';
import { ArrowLeft } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        try {
            const response = await authService.resetPassword(email);
            if (response.success) {
                setIsSuccess(true);
                setMessage(response.message);
            } else {
                setIsSuccess(false);
                setMessage(response.message);
            }
        } catch (err) {
            setIsSuccess(false);
            setMessage('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Back Link */}
            <motion.div
                className="p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-blue-500 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Login</span>
                </Link>
            </motion.div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
                {/* Logo */}
                <motion.img
                    src="/src/public/Axle-logo.svg"
                    alt="AxleMetrics"
                    className="h-8 mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                />

                {/* Heading */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Forgot Password?
                    </h1>
                    <p className="text-gray-500 max-w-sm">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </motion.div>

                {/* Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {message && (
                        <motion.p
                            className={`text-sm ${isSuccess ? 'text-green-600' : 'text-red-500'}`}
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
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                </motion.form>

                {/* Login Link */}
                <motion.p
                    className="mt-6 text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Remember your password?{' '}
                    <Link to="/login" className="font-semibold text-gray-900 hover:text-blue-500 transition-colors">
                        Sign In
                    </Link>
                </motion.p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
