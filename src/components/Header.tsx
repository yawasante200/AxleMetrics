import React from 'react';
import { Navigation } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Navigation className="h-8 w-8 text-blue-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">AxleMetrics</h1>
          </div>
          <p className="text-sm text-gray-500">Pavement Design System Calculator</p>
        </div>
      </div>
    </header>
  );
}