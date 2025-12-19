import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SelectionCardProps {
    title: string;
    description: string;
    onClick: () => void;
    icon?: React.ReactNode;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
    title,
    description,
    onClick,
    icon,
}) => {
    return (
        <button
            onClick={onClick}
            className="
        relative
        w-full
        p-6
        bg-gray-100
        border-2 border-dashed border-gray-300
        rounded-lg
        text-left
        transition-all duration-200
        hover:border-gray-400 hover:bg-gray-50
        focus:outline-none focus:ring-2 focus:ring-blue-400
        group
        min-h-[200px]
        flex flex-col justify-end
      "
        >
            {/* Arrow icon in top-right */}
            <div className="absolute top-4 right-4 text-gray-400 group-hover:text-gray-600 transition-colors">
                <ArrowRight className="w-5 h-5" />
            </div>

            {/* Optional icon */}
            {icon && (
                <div className="mb-4 text-gray-600">
                    {icon}
                </div>
            )}

            {/* Content */}
            <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-1">
                    {title}
                </h3>
                <p className="text-sm text-gray-500">
                    {description}
                </p>
            </div>
        </button>
    );
};
