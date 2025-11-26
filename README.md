# 🏠 Delhi House Price Predictor  
![WhatsApp Image 2025-11-27 at 1 04 07 AM](https://github.com/user-attachments/assets/a005fe47-254a-4ac4-b08b-c2ba925f4e4f)

### Real-Time Property Valuation using Machine Learning + Full-Stack Web App

Predict residential property prices in Delhi by leveraging machine learning and a modern, interactive web interface. Buyers, sellers, and analysts can get instant, data-driven price estimates based on location and property attributes.

---

## 🔍 Overview

This project provides **real-time house price predictions** for Delhi using a **Random Forest regression model**, exposed through a **FastAPI backend**, and served to a **React + TypeScript frontend**. The system performs automated feature engineering and displays price confidence levels and trends.

---

## 🚀 Key Features

- 🧠 **Trained ML Model (Random Forest)** on Delhi housing market data  
- ⚡️ **FastAPI REST Backend** for ultra-fast prediction APIs  
- 💡 **Automated preprocessing + feature encoding**
- 🖥 **Interactive React UI** with Tailwind CSS  
- 📊 **Feature importance & confidence scores**
- 🐳 **Docker support** for one-click deployment  
- 🔌 Clean modular architecture (Backend + Frontend separation)

---

## 📁 Project Structure

```bash
house-price-prediction/
├── README.md
├── data/
│   └── delhi_house_data.csv            # Training dataset
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI app
│   │   ├── ml_model.py                 # ML model logic
│   │   ├── schemas.py                  # API data schemas
│   │   └── config.py                   # Configs
│   ├── train_model.py                  # Model training script
│   ├── requirements.txt                # Python dependencies
│   ├── Dockerfile
│   └── models/
│       ├── random_forest_model.pkl
│       └── encoders.pkl
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── public/
├── docker-compose.yml
```


---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository

git clone https://github.com/<love543>/house-price-prediction.git
cd house-price-prediction


### 2️⃣ Dataset Setup

Place your dataset at: `data/delhi_house_data.csv`  

Required Columns:
Area, BHK, Bathroom, Furnishing, Locality, Parking, Price,
Status, Transaction, Type, Per_Sqft


### 3️⃣ Backend Setup (FastAPI)

cd backend
python -m venv venv

**Windows:**

venv\Scripts\activate

**Linux / Mac:**

source venv/bin/activate

pip install -r requirements.txt
python train_model.py # generates models in backend/models/
uvicorn app.main:app --reload


### 4️⃣ Frontend Setup (React + TS)

cd ../frontend
npm install
npm run dev


Visit UI: http://localhost:5173

### 🐳 Optional: Docker Deployment

docker-compose up --build


---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/v1/predict           | Predict price for a property |
| GET    | /api/v1/options           | Fetch dropdown options |
| GET    | /api/v1/feature-importance| Get feature importance |
| GET    | /api/v1/health            | Health status |

---

## 📈 Model Insights

- **Algorithm:** Random Forest Regressor (Scikit-Learn)
- **Evaluation:**  
  - Test R² ≈ **0.85**
  - **MAE & RMSE** logged automatically
- **Validation:** 5-fold Cross Validation  
- **Important Features:**  
  `Area, BHK, Bathroom, Locality, Furnishing, Parking, Status, Transaction, Type, Per_Sqft`

---

## 🖼 Screenshots (To Add)

Recommended:
- EDA Visualization (distribution, heatmaps, price trends)
- UI Prediction Interface + Result Insights

---

## 🛠 Technologies Used

| Category | Tech |
|----------|------|
| Backend  | FastAPI, Python 3.10+, scikit-learn, pandas |
| Frontend | React 18, TypeScript 5, Tailwind CSS |
| DevOps   | Docker, Vite, Node.js |

---

## 👨‍💻 Author

**Love Sharma (21CS2010)**  
GitHub: *love543*

---

## 📝 License

Licensed under the **MIT License**.

---

For suggestions, improvements, or bug reports — feel free to open an issue or pull request!
