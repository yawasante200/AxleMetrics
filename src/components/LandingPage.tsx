import React from 'react';

interface LandingPageProps {
  onSelectOption: (option: 'ealf' | 'truckFactor' | 'designEsals') => void;
}

export function LandingPage({ onSelectOption }: LandingPageProps) {
  return (
    <div className="max-w-4xl mx-auto pt-10 px-4">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Choose an Option</h1>
      <div className="flex flex-col space-y-4">
        <button
          onClick={() => onSelectOption('ealf')}
          className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          EALF Calculator
        </button>
        <button
          onClick={() => onSelectOption('truckFactor')}
          className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          ESAL Factor Calculator
        </button>
        <button
          onClick={() => onSelectOption('designEsals')}
          className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Design ESALs Calculator
        </button>
        
      </div>
    </div>
  );
}
