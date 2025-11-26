import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, MapPin, Home, Car, Armchair } from 'lucide-react';
import { PredictionResponse } from '../types';

interface Props {
  result: PredictionResponse;
}

const PredictionResult: React.FC<Props> = ({ result }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 rounded-lg">
          <TrendingUp className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Predicted Price</h2>
      </div>

      {/* Main Price Display */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="bg-white rounded-xl p-8 mb-6 text-center shadow-lg"
      >
        <p className="text-gray-600 text-sm mb-2">Estimated Property Value</p>
        <p className="text-5xl font-bold text-green-600 mb-3">
          {result.prediction_formatted}
        </p>
        <p className="text-gray-600 text-lg">
          ₹{result.price_in_lakhs.toFixed(2)} Lakhs
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-4 shadow"
        >
          <p className="text-gray-600 text-sm mb-1">Price per sq ft</p>
          <p className="text-2xl font-bold text-blue-600">
            ₹{result.price_per_sqft.toFixed(0)}
          </p>
        </motion.div>
        
        {result.confidence_score && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg p-4 shadow"
          >
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-purple-600" />
              <p className="text-gray-600 text-sm">Confidence</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {result.confidence_score.toFixed(1)}%
            </p>
          </motion.div>
        )}
      </div>

      {/* Property Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Property Summary</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <Home className="w-4 h-4" />
              <span>Configuration</span>
            </div>
            <span className="font-semibold text-gray-800">
              {result.features_used.bhk} BHK, {result.features_used.bathroom} Bath
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Area</span>
            <span className="font-semibold text-gray-800">
              {result.features_used.area} sq ft
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <Car className="w-4 h-4" />
              <span>Parking</span>
            </div>
            <span className="font-semibold text-gray-800">
              {result.features_used.parking} space(s)
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <Armchair className="w-4 h-4" />
              <span>Furnishing</span>
            </div>
            <span className="font-semibold text-gray-800">
              {result.features_used.furnishing}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Locality</span>
            </div>
            <span className="font-semibold text-gray-800">
              {result.features_used.locality}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600">Property Type</span>
            <span className="font-semibold text-gray-800">
              {result.features_used.type.replace('_', ' ')}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PredictionResult;
