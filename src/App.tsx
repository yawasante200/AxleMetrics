import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { MainCalculator } from './components/MainCalculator';
import TruckFactor from './components/TruckFactor';
import DesignEsal from './components/DesignEsal';
import { Header } from './components/Header';
import { ChevronLeft } from 'lucide-react';

function AppContent() {
  const [selectedOption, setSelectedOption] = useState<'ealf' | 'truckFactor' | 'designEsals' | null>(null);
  const [pavementType, setPavementType] = useState<'flexible' | 'rigid' | null>(null);
  const [calculationType, setCalculationType] = useState<'simplified' | 'aasho' | null>(null);
  const navigate = useNavigate();

  const handleReset = () => {
    setSelectedOption(null);
    setPavementType(null);
    setCalculationType(null);
  };

  const handleBack = () => {
    if (calculationType) {
      setCalculationType(null); // Go back to calculation type selection
    } else if (pavementType) {
      setPavementType(null); // Go back to pavement type selection
    } else {
      setSelectedOption(null); // Go back to the landing page
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Header />
      <Routes>
        <Route 
          path="/" 
          element={
            !selectedOption ? (
        // Landing Page
        <div className="max-w-2xl mx-auto pt-20 px-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Choose an Option</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <button
              onClick={() => setSelectedOption('ealf')}
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border border-blue-100 group"
            >
              <h3 className="text-xl font-medium text-gray-800">EALF Calculator</h3>
              <p className="text-gray-600">Calculate Equivalent Axle Load Factor</p>
            </button>
            <button
              onClick={() => setSelectedOption('truckFactor')}
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border border-blue-100 group"
            >
              <h3 className="text-xl font-medium text-gray-800">ESAL Factor Calculation</h3>
              <p className="text-gray-600">Calculate ESAL factor from axle load data</p>
            </button>
            <button
              onClick={() => setSelectedOption('designEsals')}
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border border-blue-100 group"
            >
              <h3 className="text-xl font-medium text-gray-800">Design ESAL Calculation</h3>
              <p className="text-gray-600">Calculate design ESALs for pavement design</p>
            </button>
          </div>
        </div>
      ) : selectedOption === 'truckFactor' ? (
        // Truck Factor Component
        <div className="max-w-2xl mx-auto pt-20 px-4">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center flex-1">ESAL Factor Calculation</h2>
          </div>
          <TruckFactor onBack={function (): void {
              throw new Error('Function not implemented.');
            } } onProceed={function (_pavementType: 'flexible' | 'rigid', _action: 'create' | 'import'): void {
              throw new Error('Function not implemented.');
            } } downloadExcelTemplate={function (): void {
              throw new Error('Function not implemented.');
            } } />
        </div>
      ) : selectedOption === 'designEsals' ? (
        // Design ESAL Component
        <div className="max-w-2xl mx-auto pt-20 px-4">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center flex-1">Design ESAL Calculation</h2>
          </div>
          <DesignEsal />
        </div>
      ) : selectedOption === 'ealf' && !pavementType ? (
        // Pavement Type Selection for EALF
        <div className="max-w-2xl mx-auto pt-20 px-4">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center flex-1">Choose Pavement Type</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <button
              onClick={() => setPavementType('flexible')}
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border border-blue-100 group"
            >
              <h3 className="text-xl font-medium text-gray-800">Flexible Pavement</h3>
            </button>
            <button
              onClick={() => setPavementType('rigid')}
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border border-blue-100 group"
            >
              <h3 className="text-xl font-medium text-gray-800">Rigid Pavement</h3>
            </button>
          </div>
        </div>
      ) : selectedOption === 'ealf' && !calculationType ? (
        // Calculation Type Selection for EALF
        <div className="max-w-2xl mx-auto pt-20 px-4">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center flex-1">Choose Calculation Method</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {pavementType === 'rigid' ? (
              // Only AASHO option for Rigid Pavement
              <button
                onClick={() => setCalculationType('aasho')}
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border border-blue-100 group"
              >
                <h3 className="text-xl font-medium text-gray-800">AASHO EALF</h3>
                <p className="text-gray-600">Detailed calculations using AASHO method</p>
              </button>
            ) : (
              // Both Simplified and AASHO options for Flexible Pavement
              <>
                <button
                  onClick={() => setCalculationType('simplified')}
                  className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border border-blue-100 group"
                >
                  <h3 className="text-xl font-medium text-gray-800">Simplified EALF</h3>
                  <p className="text-gray-600">Quick calculations using simplified method</p>
                </button>
                <button
                  onClick={() => setCalculationType('aasho')}
                  className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border border-blue-100 group"
                >
                  <h3 className="text-xl font-medium text-gray-800">AASHO EALF</h3>
                  <p className="text-gray-600">Detailed calculations using AASHO method</p>
                </button>
              </>
            )}
          </div>
        </div>
      ) : selectedOption === 'ealf' ? (
        <MainCalculator
          pavementType={pavementType!}
          calculationType={calculationType!}
          onReset={handleReset}
        />
      ) : null}
      />
      <Route path="/truck-factor" element={<TruckFactor />} />
      <Route path="/design-esal" element={<DesignEsal />} />
      <Route 
        path="/ealf" 
        element={
          <MainCalculator
            pavementType={pavementType!}
            calculationType={calculationType!}
            onReset={handleReset}
          />
        }
      />
    </Routes>
  </div>
  );

}
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
