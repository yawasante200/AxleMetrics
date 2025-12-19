import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { authService } from '../../services/authService';

const userTypeOptions = [
    { value: 'student', label: 'Student' },
    { value: 'hobbyist', label: 'Hobbyist' },
    { value: 'freelancer', label: 'Freelancer' },
    { value: 'researcher', label: 'Researcher' },
    { value: 'other', label: 'Other' },
];

const IndividualSignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        userType: '',
        agreeTerms: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.agreeTerms) {
            setError('Please accept the terms and conditions');
            return;
        }

        setIsLoading(true);

        try {
            const response = await authService.registerIndividual({
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                userType: formData.userType,
            });

            if (response.success) {
                // Navigate to OTP verification
                navigate('/verify-otp', { state: { email: formData.email } });
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
            <div className="p-6">
                <Link
                    to="/signup"
                    className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                    <span>←</span>
                    <span>Back</span>
                </Link>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
                {/* Logo */}
                <img
                    src="/src/public/Axle-logo.svg"
                    alt="AxleMetrics"
                    className="h-8 mb-12"
                />

                {/* Heading */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Create Your Account
                </h1>
                <p className="text-gray-500 mb-8">
                    Individual Registration
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                    <Input
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />

                    <Select
                        name="userType"
                        placeholder="What best describes you?"
                        options={userTypeOptions}
                        value={formData.userType}
                        onChange={handleChange}
                        required
                    />

                    {/* Terms Checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                            className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                        />
                        <span className="text-sm text-gray-600">
                            I agree to the{' '}
                            <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
                        </span>
                    </label>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </form>

                {/* Login Link */}
                <p className="mt-6 text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-gray-900 hover:text-blue-600">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default IndividualSignupPage;
