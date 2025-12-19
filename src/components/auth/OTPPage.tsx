import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { authService } from '../../services/authService';
import { ArrowLeft } from 'lucide-react';

const OTPPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = (location.state as { email?: string })?.email || '';

    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown timer for resend
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    const handleChange = (index: number, value: string) => {
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (/^\d+$/.test(pastedData)) {
            const newOtp = [...otp];
            pastedData.split('').forEach((digit, index) => {
                if (index < 6) newOtp[index] = digit;
            });
            setOtp(newOtp);
            const lastFilledIndex = Math.min(pastedData.length - 1, 5);
            inputRefs.current[lastFilledIndex]?.focus();
        }
    };

    const handleResend = async () => {
        if (!canResend) return;

        setCanResend(false);
        setResendTimer(60);
        setError('');

        try {
            await authService.sendOTP(email);
        } catch (err) {
            setError('Failed to resend OTP');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setIsLoading(true);

        try {
            const response = await authService.verifyOTP(otpString);
            if (response.success) {
                navigate('/login', { state: { verified: true } });
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
        <div className="min-h-screen bg-white flex flex-col">
            {/* Back Link */}
            <motion.div
                className="p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-blue-500 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
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
                        Verify Your Email
                    </h1>
                    <p className="text-gray-500 max-w-sm">
                        We've sent a 6-digit verification code to<br />
                        <span className="font-medium text-gray-700">{email || 'your email'}</span>
                    </p>
                </motion.div>

                {/* OTP Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* OTP Input Boxes */}
                    <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <motion.input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="
                  w-12 h-14
                  text-center text-xl font-semibold
                  bg-gray-100 
                  rounded-xl 
                  border-2 border-transparent
                  focus:outline-none focus:border-blue-400 focus:bg-white
                  transition-all duration-200
                "
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                            />
                        ))}
                    </div>

                    {error && (
                        <motion.p
                            className="text-red-500 text-sm text-center mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {error}
                        </motion.p>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        disabled={isLoading}
                    >
                        {isLoading ? 'Verifying...' : 'Verify'}
                    </Button>
                </motion.form>

                {/* Resend OTP */}
                <motion.div
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {canResend ? (
                        <button
                            onClick={handleResend}
                            className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                        >
                            Resend OTP
                        </button>
                    ) : (
                        <p className="text-gray-500">
                            Resend code in <span className="font-medium text-gray-700">{resendTimer}s</span>
                        </p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default OTPPage;
