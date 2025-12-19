import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SelectionCard } from '../ui/SelectionCard';

const SignupTypePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Back Link */}
            <div className="p-6">
                <Link
                    to="/login"
                    className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                    <span>←</span>
                    <span>Back to Login</span>
                </Link>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
                {/* Logo */}
                <img
                    src="/src/public/Axle-logo.svg"
                    alt="AxleMetrics"
                    className="h-8 mb-16"
                />

                {/* Heading */}
                <h1 className="text-2xl font-bold text-gray-900 mb-8">
                    Who Are You ?
                </h1>

                {/* Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                    <SelectionCard
                        title="Individual"
                        description="Students, hobbyist, Freelancers etc."
                        onClick={() => navigate('/signup/individual')}
                    />
                    <SelectionCard
                        title="Company"
                        description="Consultancies, Construction Companies etc."
                        onClick={() => navigate('/signup/company')}
                    />
                </div>
            </div>
        </div>
    );
};

export default SignupTypePage;
