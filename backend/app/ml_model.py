import pickle
import numpy as np
from typing import Dict, Any, Tuple
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

class HousePriceModel:
    def __init__(self, model_path: str, encoders_path: str):
        self.model = None
        self.encoders = None
        self.model_path = Path(model_path)
        self.encoders_path = Path(encoders_path)
        self.load_model()
    
    def load_model(self) -> None:
        """Load the trained model and encoders"""
        try:
            with open(self.model_path, 'rb') as f:
                self.model = pickle.load(f)
            with open(self.encoders_path, 'rb') as f:
                self.encoders = pickle.load(f)
            logger.info("Model and encoders loaded successfully")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise
    
    def predict(self, features: Dict[str, Any]) -> Tuple[float, float]:
        """Make a prediction based on input features"""
        if self.model is None or self.encoders is None:
            raise ValueError("Model not loaded")
        
        # Extract and normalize features
        area = float(features['area'])
        bhk = int(features['bhk'])
        bathroom = int(features['bathroom'])
        parking = int(features['parking'])
        
        # Calculate derived features
        area_yards = area / 9
        per_sqft_default = 6667.0
        
        # Encode categorical variables
        furnishing_encoded = self.encoders['furnishing'].transform([features['furnishing']])[0]
        locality_encoded = self.encoders['locality'].transform([features['locality']])[0]
        status_encoded = self.encoders['status'].transform([features['status']])[0]
        transaction_encoded = self.encoders['transaction'].transform([features['transaction']])[0]
        type_encoded = self.encoders['type'].transform([features['type']])[0]
        
        # Normalize numerical features
        area_norm = area / self.encoders['max_area']
        per_sqft_norm = per_sqft_default / self.encoders['max_per_sqft']
        area_yards_norm = area_yards / self.encoders['max_area_yards']
        
        # Create feature array
        feature_array = np.array([[
            area_norm,
            bhk,
            bathroom,
            furnishing_encoded,
            locality_encoded,
            parking,
            status_encoded,
            transaction_encoded,
            type_encoded,
            per_sqft_norm,
            area_yards_norm
        ]])
        
        # Make prediction
        prediction_norm = self.model.predict(feature_array)[0]
        prediction_price = prediction_norm * self.encoders['max_price']
        
        # Calculate confidence (if using RandomForest)
        try:
            predictions = np.array([tree.predict(feature_array)[0] for tree in self.model.estimators_])
            confidence = 1 - (predictions.std() / predictions.mean())
        except:
            confidence = 0.85
        
        return float(prediction_price), float(confidence)
    
    def get_feature_importance(self) -> Dict[str, float]:
        """Get feature importance from the model"""
        if hasattr(self.model, 'feature_importances_'):
            features = ['Area', 'BHK', 'Bathroom', 'Furnishing', 'Locality', 
                       'Parking', 'Status', 'Transaction', 'Type', 'Per_Sqft', 'Area_Yards']
            return dict(zip(features, self.model.feature_importances_.tolist()))
        return {}
    
    def get_available_options(self) -> Dict[str, list]:
        """Get all available options for dropdowns"""
        return {
            'furnishing': self.encoders['furnishing'].classes_.tolist(),
            'localities': self.encoders['locality'].classes_.tolist(),
            'status': self.encoders['status'].classes_.tolist(),
            'transaction': self.encoders['transaction'].classes_.tolist(),
            'types': self.encoders['type'].classes_.tolist()
        }
