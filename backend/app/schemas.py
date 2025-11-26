from pydantic import BaseModel, Field, validator
from typing import Optional, Literal
from enum import Enum

class FurnishingType(str, Enum):
    FURNISHED = "Furnished"
    SEMI_FURNISHED = "Semi-Furnished"
    UNFURNISHED = "Unfurnished"

class StatusType(str, Enum):
    READY_TO_MOVE = "Ready_to_move"
    UNDER_CONSTRUCTION = "Under_construction"
    ALMOST_READY = "Almost_ready"

class TransactionType(str, Enum):
    NEW_PROPERTY = "New_Property"
    RESALE = "Resale"

class PropertyType(str, Enum):
    APARTMENT = "Apartment"
    BUILDER_FLOOR = "Builder_Floor"
    PENTHOUSE = "Penthouse"

class PredictionRequest(BaseModel):
    area: float = Field(..., ge=100, le=10000, description="Area in square feet")
    bhk: int = Field(..., ge=1, le=5, description="Number of bedrooms")
    bathroom: int = Field(..., ge=1, le=5, description="Number of bathrooms")
    parking: int = Field(..., ge=0, le=10, description="Number of parking spaces")
    furnishing: FurnishingType
    locality: str = Field(..., min_length=1, max_length=100)
    status: StatusType
    transaction: TransactionType
    type: PropertyType
    
    class Config:
        json_schema_extra = {
            "example": {
                "area": 1200,
                "bhk": 3,
                "bathroom": 2,
                "parking": 1,
                "furnishing": "Semi-Furnished",
                "locality": "Rohini Sector",
                "status": "Ready_to_move",
                "transaction": "New_Property",
                "type": "Apartment"
            }
        }

class PredictionResponse(BaseModel):
    success: bool
    prediction: float
    prediction_formatted: str
    price_in_lakhs: float
    price_per_sqft: float
    confidence_score: Optional[float] = None
    features_used: dict
    timestamp: str

class OptionsResponse(BaseModel):
    furnishing: list[str]
    localities: list[str]
    status: list[str]
    transaction: list[str]
    types: list[str]

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    version: str
