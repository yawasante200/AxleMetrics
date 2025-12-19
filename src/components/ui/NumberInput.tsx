import React, { forwardRef } from 'react';
import { HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    suffix?: string;
    tooltip?: string;
    error?: string;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    ({ label, suffix, tooltip, error, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                        {label}
                    </label>
                    {tooltip && (
                        <div className="group relative">
                            <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
                            <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                                {tooltip}
                                <div className="absolute bottom-0 right-1 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative group">
                    <input
                        type="number"
                        ref={ref}
                        className={`
              block w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent 
              text-gray-900 placeholder-gray-400 font-medium transition-all duration-200
              focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'hover:bg-gray-100'}
              ${suffix ? 'pr-12' : ''}
              ${className}
            `}
                        {...props}
                    />
                    {suffix && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <span className="text-gray-500 font-medium text-sm">{suffix}</span>
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-1 text-sm text-red-500 font-medium"
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);

NumberInput.displayName = 'NumberInput';
