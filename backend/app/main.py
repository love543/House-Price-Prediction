from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
from datetime import datetime
from typing import Dict

from .config import settings
from .schemas import (
    PredictionRequest, PredictionResponse, 
    OptionsResponse, HealthResponse
)
from .ml_model import HousePriceModel

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global model instance
ml_model: HousePriceModel = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global ml_model
    try:
        ml_model = HousePriceModel(
            model_path=settings.MODEL_PATH,
            encoders_path=settings.ENCODERS_PATH
        )
        logger.info("Application startup complete")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
    
    yield
    
    # Shutdown
    logger.info("Application shutdown")

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="AI-powered house price prediction API for Delhi properties",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "version": settings.VERSION,
        "docs": "/docs"
    }

# Health check
@app.get(
    f"{settings.API_PREFIX}/health",
    response_model=HealthResponse,
    tags=["Health"]
)
async def health_check():
    """Check API and model health status"""
    return HealthResponse(
        status="healthy",
        model_loaded=ml_model is not None,
        version=settings.VERSION
    )

# Get available options
@app.get(
    f"{settings.API_PREFIX}/options",
    response_model=OptionsResponse,
    tags=["Options"]
)
async def get_options():
    """Get all available options for property features"""
    try:
        if ml_model is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Model not loaded"
            )
        
        options = ml_model.get_available_options()
        return OptionsResponse(**options)
    
    except Exception as e:
        logger.error(f"Error getting options: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

# Predict house price
@app.post(
    f"{settings.API_PREFIX}/predict",
    response_model=PredictionResponse,
    tags=["Prediction"]
)
async def predict_price(request: PredictionRequest):
    """Predict house price based on property features"""
    try:
        if ml_model is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Model not loaded"
            )
        
        # Convert request to dict
        features = request.model_dump()
        
        # Make prediction
        prediction, confidence = ml_model.predict(features)
        
        # Format response
        price_in_crores = prediction / 10000000
        price_in_lakhs = prediction / 100000
        price_per_sqft = prediction / features['area']
        
        prediction_formatted = (
            f"₹{price_in_crores:.2f} Cr" if prediction >= 10000000 
            else f"₹{price_in_lakhs:.2f} L"
        )
        
        return PredictionResponse(
            success=True,
            prediction=round(prediction, 2),
            prediction_formatted=prediction_formatted,
            price_in_lakhs=round(price_in_lakhs, 2),
            price_per_sqft=round(price_per_sqft, 2),
            confidence_score=round(confidence * 100, 2),
            features_used=features,
            timestamp=datetime.now().isoformat()
        )
    
    except ValueError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during prediction"
        )

# Get feature importance
@app.get(
    f"{settings.API_PREFIX}/feature-importance",
    tags=["Analysis"]
)
async def get_feature_importance():
    """Get feature importance from the trained model"""
    try:
        if ml_model is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Model not loaded"
            )
        
        importance = ml_model.get_feature_importance()
        return {"feature_importance": importance}
    
    except Exception as e:
        logger.error(f"Error getting feature importance: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

# Exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "timestamp": datetime.now().isoformat()
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
