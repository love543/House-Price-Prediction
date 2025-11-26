import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { Building2, Sparkles } from 'lucide-react';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import { PredictionRequest, PredictionResponse } from './types';
import { predictPrice } from './services/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const handlePredict = async (data: PredictionRequest) => {
    setLoading(true);
    try {
      const response = await predictPrice(data);
      setResult(response);
      toast.success('Prediction successful!');
    } catch (error: any) {
      console.error('Prediction error:', error);
      toast.error(error.response?.data?.error || 'Failed to predict price');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="bg-white shadow-lg"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Delhi House Price Predictor
                </h1>
                <p className="text-gray-600 text-sm">AI-Powered Real Estate Valuation</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">84.98% Accuracy</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <PredictionForm onSubmit={handlePredict} loading={loading} />
          </div>

          {/* Results */}
          <div>
            {result ? (
              <PredictionResult result={result} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-xl p-12 flex flex-col items-center justify-center h-full"
              >
                <div className="p-6 bg-blue-50 rounded-full mb-6">
                  <Building2 className="w-16 h-16 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Ready to Predict?
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                  Fill in the property details on the left and click "Predict Price" to get
                  an AI-powered valuation of your property in Delhi.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>Built with FastAPI, React, TypeScript & Machine Learning</p>
          <p className="text-sm mt-2">Random Forest Model • R² Score: ~84.98%</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
