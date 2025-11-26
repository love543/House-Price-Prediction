export interface PredictionRequest {
  area: number;
  bhk: number;
  bathroom: number;
  parking: number;
  furnishing: string;
  locality: string;
  status: string;
  transaction: string;
  type: string;
}

export interface PredictionResponse {
  success: boolean;
  prediction: number;
  prediction_formatted: string;
  price_in_lakhs: number;
  price_per_sqft: number;
  confidence_score?: number;
  features_used: PredictionRequest;
  timestamp: string;
}

export interface OptionsResponse {
  furnishing: string[];
  localities: string[];
  status: string[];
  transaction: string[];
  types: string[];
}
