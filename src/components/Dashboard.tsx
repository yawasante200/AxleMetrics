import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FeatureCardProps {
    title: string;
    description: string;
    image: string;
    onClick: () => void;
    delay?: number;
}

function FeatureCard({ title, description, image, onClick, delay = 0 }: FeatureCardProps) {
    return (
        <motion.button
            onClick={onClick}
            className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -4 }}
        >
            {/* Illustration Image */}
            <div className="h-44 overflow-hidden bg-gray-50">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-900 transition-colors">
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>
        </motion.button>
    );
}

interface DashboardProps {
    onSelectFeature: (feature: 'ealf' | 'truckFactor' | 'designEsals') => void;
}

export function Dashboard({ onSelectFeature }: DashboardProps) {
    const { user } = useAuth();

    const features = [
        {
            id: 'ealf' as const,
            title: 'EALF Calculator',
            description: 'Calculate Equivalent Axle Load Factor for pavement design',
            image: '/src/public/ealf-card.png',
        },
        {
            id: 'truckFactor' as const,
            title: 'ESAL Factor Calculation',
            description: 'Calculate ESAL factor from axle load data',
            image: '/src/public/esal-factor-card.png',
        },
        {
            id: 'designEsals' as const,
            title: 'Design ESAL Calculation',
            description: 'Calculate design ESALs for pavement design period',
            image: '/src/public/design-esal-card.png',
        },
    ];

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Welcome Section */}
                <motion.div
                    className="mb-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
                    </h1>
                    <p className="text-gray-500">
                        Select a calculator to get started with your pavement analysis
                    </p>
                </motion.div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={feature.id}
                            title={feature.title}
                            description={feature.description}
                            image={feature.image}
                            onClick={() => onSelectFeature(feature.id)}
                            delay={0.1 + index * 0.1}
                        />
                    ))}
                </div>

                {/* Footer Info */}
                <motion.div
                    className="mt-10 p-5 bg-white rounded-xl border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-0.5">Pavement Traffic Load & ESAL Analysis</p>
                            <p className="text-base font-medium text-gray-900">Unparalleled accuracy for all your pavement designs</p>
                        </div>
                        <span className="hidden sm:block text-xs text-gray-400">AASHTO Standards</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
