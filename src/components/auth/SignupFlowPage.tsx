import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { SelectionCard } from '../ui/SelectionCard';
import { authService } from '../../services/authService';
import { ArrowLeft } from 'lucide-react';

type AccountType = 'individual' | 'company' | null;
type Step = 'type' | 'details' | 'complete';

const userTypeOptions = [
    { value: 'student', label: 'Student' },
    { value: 'hobbyist', label: 'Hobbyist' },
    { value: 'freelancer', label: 'Freelancer' },
    { value: 'researcher', label: 'Researcher' },
    { value: 'other', label: 'Other' },
];

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0,
    }),
};

const SignupFlowPage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('type');
    const [accountType, setAccountType] = useState<AccountType>(null);
    const [direction, setDirection] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Individual form data
    const [individualData, setIndividualData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        userType: '',
        agreeTerms: false,
    });

    // Company form data
    const [companyData, setCompanyData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        location: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
    });

    const handleSelectType = (type: AccountType) => {
        setAccountType(type);
        setDirection(1);
        setStep('details');
    };

    const handleBack = () => {
        setDirection(-1);
        if (step === 'details') {
            setStep('type');
            setAccountType(null);
        } else if (step === 'type') {
            navigate('/login');
        }
    };

    const handleIndividualChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setIndividualData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setCompanyData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (accountType === 'individual' && !individualData.agreeTerms) {
            setError('Please accept the terms and conditions');
            return;
        }

        if (accountType === 'company') {
            if (companyData.password !== companyData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            if (!companyData.agreeTerms) {
                setError('Please accept the terms and conditions');
                return;
            }
        }

        setIsLoading(true);

        try {
            let response;
            if (accountType === 'individual') {
                response = await authService.registerIndividual({
                    fullName: individualData.fullName,
                    email: individualData.email,
                    phone: individualData.phone,
                    password: individualData.password,
                    userType: individualData.userType,
                });
            } else {
                response = await authService.registerCompany({
                    companyName: companyData.companyName,
                    contactPerson: companyData.contactPerson,
                    email: companyData.email,
                    phone: companyData.phone,
                    location: companyData.location,
                    password: companyData.password,
                });
            }

            if (response.success) {
                navigate('/verify-otp', {
                    state: { email: accountType === 'individual' ? individualData.email : companyData.email }
                });
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getStepNumber = () => {
        switch (step) {
            case 'type': return 1;
            case 'details': return 2;
            default: return 1;
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header with Back and Progress */}
            <div className="p-6 flex items-center justify-between">
                <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-blue-500 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back {step === 'type' ? 'to Login' : ''}</span>
                </button>

                {/* Progress Indicator */}
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-1 rounded-full transition-colors ${getStepNumber() >= 1 ? 'bg-gray-900' : 'bg-gray-200'}`} />
                    <div className={`w-8 h-1 rounded-full transition-colors ${getStepNumber() >= 2 ? 'bg-gray-900' : 'bg-gray-200'}`} />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16 overflow-hidden">
                {/* Logo */}
                <motion.img
                    src="/src/public/Axle-logo.svg"
                    alt="AxleMetrics"
                    className="h-8 mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                />

                <AnimatePresence mode="wait" custom={direction}>
                    {/* Step 1: Account Type Selection */}
                    {step === 'type' && (
                        <motion.div
                            key="type"
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="w-full max-w-2xl"
                        >
                            <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                                Who Are You?
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SelectionCard
                                    title="Individual"
                                    description="Students, hobbyist, Freelancers etc."
                                    onClick={() => handleSelectType('individual')}
                                />
                                <SelectionCard
                                    title="Company"
                                    description="Consultancies, Construction Companies etc."
                                    onClick={() => handleSelectType('company')}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Details Form */}
                    {step === 'details' && (
                        <motion.div
                            key="details"
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="w-full max-w-md"
                        >
                            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                                Create Your Account
                            </h1>
                            <p className="text-gray-500 mb-8 text-center">
                                {accountType === 'individual' ? 'Individual Registration' : 'Company Registration'}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {accountType === 'individual' ? (
                                    <>
                                        <Input
                                            name="fullName"
                                            placeholder="Full Name"
                                            value={individualData.fullName}
                                            onChange={handleIndividualChange}
                                            required
                                        />
                                        <Input
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            value={individualData.email}
                                            onChange={handleIndividualChange}
                                            required
                                        />
                                        <Input
                                            type="tel"
                                            name="phone"
                                            placeholder="Phone Number"
                                            value={individualData.phone}
                                            onChange={handleIndividualChange}
                                            required
                                        />
                                        <Input
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            value={individualData.password}
                                            onChange={handleIndividualChange}
                                            required
                                            minLength={6}
                                        />
                                        <Select
                                            name="userType"
                                            placeholder="What best describes you?"
                                            options={userTypeOptions}
                                            value={individualData.userType}
                                            onChange={handleIndividualChange}
                                            required
                                        />
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="agreeTerms"
                                                checked={individualData.agreeTerms}
                                                onChange={handleIndividualChange}
                                                className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                                            />
                                            <span className="text-sm text-gray-600">
                                                I agree to the{' '}
                                                <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
                                                {' '}and{' '}
                                                <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
                                            </span>
                                        </label>
                                    </>
                                ) : (
                                    <>
                                        <Input
                                            name="companyName"
                                            placeholder="Company Name"
                                            value={companyData.companyName}
                                            onChange={handleCompanyChange}
                                            required
                                        />
                                        <Input
                                            name="contactPerson"
                                            placeholder="Contact Person Name"
                                            value={companyData.contactPerson}
                                            onChange={handleCompanyChange}
                                            required
                                        />
                                        <Input
                                            type="email"
                                            name="email"
                                            placeholder="Company Email"
                                            value={companyData.email}
                                            onChange={handleCompanyChange}
                                            required
                                        />
                                        <Input
                                            type="tel"
                                            name="phone"
                                            placeholder="Phone Number"
                                            value={companyData.phone}
                                            onChange={handleCompanyChange}
                                            required
                                        />
                                        <Input
                                            name="location"
                                            placeholder="Company Location"
                                            value={companyData.location}
                                            onChange={handleCompanyChange}
                                            required
                                        />
                                        <Input
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            value={companyData.password}
                                            onChange={handleCompanyChange}
                                            required
                                            minLength={6}
                                        />
                                        <Input
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            value={companyData.confirmPassword}
                                            onChange={handleCompanyChange}
                                            required
                                        />
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="agreeTerms"
                                                checked={companyData.agreeTerms}
                                                onChange={handleCompanyChange}
                                                className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                                            />
                                            <span className="text-sm text-gray-600">
                                                I agree to the{' '}
                                                <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
                                                {' '}and{' '}
                                                <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
                                            </span>
                                        </label>
                                    </>
                                )}

                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-red-500 text-sm"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                <Button
                                    type="submit"
                                    fullWidth
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Creating Account...' : 'Create Account'}
                                </Button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Login Link */}
                <motion.p
                    className="mt-8 text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-gray-900 hover:text-blue-500 transition-colors">
                        Sign In
                    </Link>
                </motion.p>
            </div>
        </div>
    );
};

export default SignupFlowPage;
