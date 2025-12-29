import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { MainCalculator } from './components/MainCalculator';
import TruckFactor from './components/TruckFactor';
import DesignEsal from './components/DesignEsal';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ChevronLeft } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './components/auth/LoginPage';
import SignupFlowPage from './components/auth/SignupFlowPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import OTPPage from './components/auth/OTPPage';

function AppContent() {
  const [selectedOption, setSelectedOption] = useState<'ealf' | 'truckFactor' | 'designEsals' | null>(null);
  const [pavementType, setPavementType] = useState<'flexible' | 'rigid' | null>(null);
  const [calculationType, setCalculationType] = useState<'simplified' | 'aasho' | null>(null);
  const [truckFactorResults, setTruckFactorResults] = useState<any>(null);

  const location = useLocation();
  const isAuthRoute = ['/login', '/signup', '/forgot-password', '/verify-otp'].includes(location.pathname);

  const handleReset = () => {
    setSelectedOption(null);
    setPavementType(null);
    setCalculationType(null);
    setTruckFactorResults(null);
  };

  const handleBack = () => {
    if (calculationType) {
      setCalculationType(null);
    } else if (pavementType) {
      setPavementType(null);
    } else {
      setSelectedOption(null);
      setTruckFactorResults(null);
    }
  };

  const handleSelectFeature = (feature: 'ealf' | 'truckFactor' | 'designEsals') => {
    setSelectedOption(feature);
    setTruckFactorResults(null);
  };

  const handleProceedToDesignEsal = (data: any) => {
    setTruckFactorResults(data);
    setSelectedOption('designEsals');
  };

  const handleBackToTruckFactor = () => {
    setSelectedOption('truckFactor');
  };

  const handleBackToDashboard = () => {
    setSelectedOption(null);
    setPavementType(null);
    setCalculationType(null);
    setTruckFactorResults(null);
  };

  return (
    <div className={`min-h-screen ${isAuthRoute ? 'bg-white' : 'bg-gray-50/50'}`}>
      {!isAuthRoute && <Header />}

      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupFlowPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<OTPPage />} />

        {/* Protected Main App Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {!selectedOption ? (
                <Dashboard onSelectFeature={handleSelectFeature} />
              ) : selectedOption === 'truckFactor' ? (
                <div className="max-w-4xl mx-auto py-8 px-4">
                  <button 
                    onClick={handleBackToDashboard} 
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Dashboard</span>
                  </button>
                  <TruckFactor 
                    onProceedToDesignEsal={handleProceedToDesignEsal}
                  />
                </div>
              ) : selectedOption === 'designEsals' ? (
                <div className="max-w-4xl mx-auto py-8 px-4">
                  <button 
                    onClick={truckFactorResults ? handleBackToTruckFactor : handleBackToDashboard}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="font-medium">
                      {truckFactorResults ? 'Back to Truck Factor' : 'Back to Dashboard'}
                    </span>
                  </button>
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Design ESAL Calculation</h2>
                    <DesignEsal initialData={truckFactorResults} />
                  </div>
                </div>
              ) : selectedOption === 'ealf' && !pavementType ? (
                <div className="max-w-2xl mx-auto py-12 px-4">
                  <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Dashboard</span>
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Pavement Type</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <button
                      onClick={() => setPavementType('flexible')}
                      className="p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all text-left group"
                    >
                      <h3 className="text-lg font-medium text-gray-900">Flexible Pavement</h3>
                      <p className="text-sm text-gray-500 mt-1">Asphalt-based pavement design</p>
                    </button>
                    <button
                      onClick={() => setPavementType('rigid')}
                      className="p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all text-left group"
                    >
                      <h3 className="text-lg font-medium text-gray-900">Rigid Pavement</h3>
                      <p className="text-sm text-gray-500 mt-1">Concrete-based pavement design</p>
                    </button>
                  </div>
                </div>
              ) : selectedOption === 'ealf' && !calculationType ? (
                <div className="max-w-2xl mx-auto py-12 px-4">
                  <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Calculation Method</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {pavementType === 'rigid' ? (
                      <button
                        onClick={() => setCalculationType('aasho')}
                        className="p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all text-left"
                      >
                        <h3 className="text-lg font-medium text-gray-900">AASHO EALF</h3>
                        <p className="text-sm text-gray-500 mt-1">Detailed calculations using AASHO method</p>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setCalculationType('simplified')}
                          className="p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all text-left"
                        >
                          <h3 className="text-lg font-medium text-gray-900">Simplified EALF</h3>
                          <p className="text-sm text-gray-500 mt-1">Quick calculations using simplified method</p>
                        </button>
                        <button
                          onClick={() => setCalculationType('aasho')}
                          className="p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all text-left"
                        >
                          <h3 className="text-lg font-medium text-gray-900">AASHO EALF</h3>
                          <p className="text-sm text-gray-500 mt-1">Detailed calculations using AASHO method</p>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : selectedOption === 'ealf' ? (
                <div className="py-8">
                  <MainCalculator
                    pavementType={pavementType!}
                    calculationType={calculationType!}
                    onReset={handleReset}
                  />
                </div>
              ) : null}
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;