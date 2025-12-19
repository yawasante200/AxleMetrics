import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { authService } from '../../services/authService';

const CompanySignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        location: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!formData.agreeTerms) {
            setError('Please accept the terms and conditions');
            return;
        }

        setIsLoading(true);

        try {
            const response = await authService.registerCompany({
                companyName: formData.companyName,
                contactPerson: formData.contactPerson,
                email: formData.email,
                phone: formData.phone,
                location: formData.location,
                password: formData.password,
            });

            if (response.success) {
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
                    Create Company Account
                </h1>
                <p className="text-gray-500 mb-8">
                    For Consultancies & Construction Companies
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                    <Input
                        name="companyName"
                        placeholder="Company Name"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        name="contactPerson"
                        placeholder="Contact Person Name"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        type="email"
                        name="email"
                        placeholder="Company Email"
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
                        name="location"
                        placeholder="Company Location"
                        value={formData.location}
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

                    <Input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
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

export default CompanySignupPage;
