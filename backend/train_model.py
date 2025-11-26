import numpy as np
import pandas as pd
import pickle
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def train_and_save_model(data_path='../data/delhi_house_data.csv'):
    """Train Random Forest model with enhanced features and save it"""
    
    logger.info("Loading data...")
    df = pd.read_csv(data_path)
    
    logger.info(f"Dataset shape: {df.shape}")
    logger.info(f"Columns: {df.columns.tolist()}")
    
    # Data preprocessing
    logger.info("Preprocessing data...")
    df = df.dropna()
    
    # Create derived features
    df['Area_Yards'] = df['Area'] / 9
    
    if 'Per_Sqft' in df.columns:
        df['Per_Sqft'] = df['Per_Sqft'].fillna(df['Per_Sqft'].median())
    else:
        df['Per_Sqft'] = df['Price'] / df['Area']
    
    # Clean Locality
    df['Locality'] = df['Locality'].apply(
        lambda x: ' '.join(str(x).split()[:2]) if pd.notna(x) else 'Unknown'
    )
    
    # Initialize encoders
    encoders = {}
    categorical_cols = ['Furnishing', 'Locality', 'Status', 'Transaction', 'Type']
    
    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        encoders[col.lower()] = le
    
    # Store normalization parameters
    encoders['max_area'] = float(df['Area'].max())
    encoders['max_per_sqft'] = float(df['Per_Sqft'].max())
    encoders['max_area_yards'] = float(df['Area_Yards'].max())
    encoders['max_price'] = float(df['Price'].max())
    
    # Normalize
    df['Area'] = df['Area'] / encoders['max_area']
    df['Per_Sqft'] = df['Per_Sqft'] / encoders['max_per_sqft']
    df['Area_Yards'] = df['Area_Yards'] / encoders['max_area_yards']
    df['Price'] = df['Price'] / encoders['max_price']
    
    # Features and target
    feature_cols = ['Area', 'BHK', 'Bathroom', 'Furnishing', 'Locality', 
                    'Parking', 'Status', 'Transaction', 'Type', 'Per_Sqft', 'Area_Yards']
    
    X = df[feature_cols]
    y = df['Price']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    logger.info(f"Training set: {X_train.shape[0]} samples")
    logger.info(f"Test set: {X_test.shape[0]} samples")
    
    # Train model with optimized parameters
    logger.info("Training Random Forest model...")
    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
        verbose=1
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    
    logger.info(f"\n{'='*50}")
    logger.info(f"Training R² Score: {train_score:.4f}")
    logger.info(f"Testing R² Score: {test_score:.4f}")
    logger.info(f"MAE: {mae:.4f}")
    logger.info(f"RMSE: {rmse:.4f}")
    logger.info(f"{'='*50}\n")
    
    # Cross-validation
    cv_scores = cross_val_score(model, X, y, cv=5, scoring='r2')
    logger.info(f"Cross-validation R² scores: {cv_scores}")
    logger.info(f"Mean CV R² Score: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': feature_cols,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    logger.info("\nFeature Importance:")
    logger.info(feature_importance.to_string())
    
    # Save model
    os.makedirs('models', exist_ok=True)
    
    with open('models/random_forest_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    with open('models/encoders.pkl', 'wb') as f:
        pickle.dump(encoders, f)
    
    logger.info("\n✓ Model and encoders saved successfully!")
    
    return model, encoders

if __name__ == '__main__':
    DATA_PATH = 'data/delhi_house_data.csv'  
    
    if not os.path.exists(DATA_PATH):
        logger.error(f"Data file not found at {DATA_PATH}")
    else:
        train_and_save_model(DATA_PATH)
