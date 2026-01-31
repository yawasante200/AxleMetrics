import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { authService } from '../../services/authService';
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const validatePassword = (pass: string): string[] => {
        const errors: string[] = [];
        if (pass.length < 8) errors.push('At least 8 characters');
        if (!/[A-Z]/.test(pass)) errors.push('One uppercase letter');
        if (!/[a-z]/.test(pass)) errors.push('One lowercase letter');
        if (!/[0-9]/.test(pass)) errors.push('One number');
        return errors;
    };

    const passwordErrors = validatePassword(password);
    const passwordsMatch = password === confirmPassword && password.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        if (passwordErrors.length > 0) {
            setMessage('Please meet all password requirements');
            setIsSuccess(false);
            return;
        }

        if (!passwordsMatch) {
            setMessage('Passwords do not match');
            setIsSuccess(false);
            return;
        }

        setIsLoading(true);

        try {
            const response = await authService.confirmResetPassword(token, password);
            if (response.success) {
                setIsSuccess(true);
                setMessage(response.message);
                // Redirect to login after 2 seconds
                setTimeout(() => navigate('/login'), 2000);
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
                        Reset Your Password
                    </h1>
                    <p className="text-gray-500 max-w-sm">
                        Create a new password for your account.
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
                    {/* Password Field */}
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Password Requirements */}
                    {password.length > 0 && (
                        <motion.div
                            className="bg-gray-50 rounded-lg p-3 space-y-1"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                        >
                            <p className="text-xs font-medium text-gray-600 mb-2">Password must have:</p>
                            {[
                                { label: 'At least 8 characters', met: password.length >= 8 },
                                { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
                                { label: 'One lowercase letter', met: /[a-z]/.test(password) },
                                { label: 'One number', met: /[0-9]/.test(password) },
                            ].map((req, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Check className={`w-3 h-3 ${req.met ? 'text-green-500' : 'text-gray-300'}`} />
                                    <span className={`text-xs ${req.met ? 'text-green-600' : 'text-gray-400'}`}>
                                        {req.label}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* Confirm Password Field */}
                    <div className="relative">
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Password Match Indicator */}
                    {confirmPassword.length > 0 && (
                        <motion.div
                            className={`flex items-center gap-2 text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {passwordsMatch ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    <span>Passwords match</span>
                                </>
                            ) : (
                                <span>Passwords do not match</span>
                            )}
                        </motion.div>
                    )}

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
                        disabled={isLoading || passwordErrors.length > 0 || !passwordsMatch}
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPasswordPage;
