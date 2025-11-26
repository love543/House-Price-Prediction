import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, DollarSign, Loader2 } from 'lucide-react';
import { PredictionRequest, OptionsResponse } from '../types';
import { getOptions } from '../services/api';

interface Props {
  onSubmit: (data: PredictionRequest) => void;
  loading: boolean;
}

const PredictionForm: React.FC<Props> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<PredictionRequest>({
    area: 1200,
    bhk: 3,
    bathroom: 2,
    parking: 1,
    furnishing: 'Semi-Furnished',
    locality: '',
    status: 'Ready_to_move',
    transaction: 'New_Property',
    type: 'Apartment',
  });

  const [options, setOptions] = useState<OptionsResponse | null>(null);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const data = await getOptions();
      setOptions(data);
      if (data.localities.length > 0) {
        setFormData(prev => ({ ...prev, locality: data.localities[0] }));
      }
    } catch (error) {
      console.error('Error loading options:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['area', 'bhk', 'bathroom', 'parking'].includes(name) 
        ? Number(value) 
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Home className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Property Details</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Area */}
          <div>
            <label htmlFor="area" className={labelClass}>
              Area (sq ft)
            </label>
            <input
              type="number"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              min="100"
              max="10000"
              step="50"
              className={inputClass}
              required
            />
          </div>

          {/* BHK */}
          <div>
            <label htmlFor="bhk" className={labelClass}>
              BHK
            </label>
            <select
              id="bhk"
              name="bhk"
              value={formData.bhk}
              onChange={handleChange}
              className={inputClass}
              required
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} BHK</option>
              ))}
            </select>
          </div>

          {/* Bathroom */}
          <div>
            <label htmlFor="bathroom" className={labelClass}>
              Bathrooms
            </label>
            <select
              id="bathroom"
              name="bathroom"
              value={formData.bathroom}
              onChange={handleChange}
              className={inputClass}
              required
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          {/* Parking */}
          <div>
            <label htmlFor="parking" className={labelClass}>
              Parking Spaces
            </label>
            <select
              id="parking"
              name="parking"
              value={formData.parking}
              onChange={handleChange}
              className={inputClass}
              required
            >
              {[0, 1, 2, 3].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          {/* Furnishing */}
          <div>
            <label htmlFor="furnishing" className={labelClass}>
              Furnishing
            </label>
            <select
              id="furnishing"
              name="furnishing"
              value={formData.furnishing}
              onChange={handleChange}
              className={inputClass}
              required
            >
              {options?.furnishing.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Locality */}
          <div>
            <label htmlFor="locality" className={labelClass}>
              Locality
            </label>
            <select
              id="locality"
              name="locality"
              value={formData.locality}
              onChange={handleChange}
              className={inputClass}
              required
            >
              {options?.localities.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className={labelClass}>
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
              required
            >
              {options?.status.map(option => (
                <option key={option} value={option}>
                  {option.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Transaction */}
          <div>
            <label htmlFor="transaction" className={labelClass}>
              Transaction
            </label>
            <select
              id="transaction"
              name="transaction"
              value={formData.transaction}
              onChange={handleChange}
              className={inputClass}
              required
            >
              {options?.transaction.map(option => (
                <option key={option} value={option}>
                  {option.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div className="md:col-span-2">
            <label htmlFor="type" className={labelClass}>
              Property Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={inputClass}
              required
            >
              {options?.types.map(option => (
                <option key={option} value={option}>
                  {option.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Predicting...
            </>
          ) : (
            <>
              <DollarSign className="w-5 h-5" />
              Predict Price
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default PredictionForm;
