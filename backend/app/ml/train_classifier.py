"""
EcoWise AI - Machine Learning Classifier Training Pipeline
Trains a Scikit-Learn Gradient Boosting & Random Forest Classifier on NIR spectral reflectance,
optical density, capacitance, and X-ray transmission features. Serializes model to disk.
"""

import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import classification_report, accuracy_score

def train_and_serialize():
    print("Initializing EcoWise AI ML Model Training Pipeline...")
    
    # Feature Vector Schema (5 Features):
    # 0: NIR Spectral Reflectance at 850nm (0.0 to 1.0)
    # 1: Material Density (g/cm³) (0.1 to 5.0)
    # 2: Metallic Capacitance Response (0.0 to 1.0)
    # 3: Moisture Content Percentage (0.0 to 1.0)
    # 4: X-Ray Attenuation Index (0.0 to 1.0)
    
    # Class mapping:
    # 0: PET Plastic (Dry Recyclable)
    # 1: Aluminum Can (Metals)
    # 2: E-Waste Circuit Board (Hazardous)
    # 3: Cardboard Box (Paper)
    # 4: Compostable Food Waste (Organic)
    
    np.random.seed(42)
    n_samples_per_class = 200
    
    X_list = []
    y_list = []
    
    # PET Plastic samples
    pet_samples = np.random.normal(loc=[0.85, 1.38, 0.05, 0.02, 0.15], scale=[0.03, 0.05, 0.02, 0.01, 0.02], size=(n_samples_per_class, 5))
    X_list.append(pet_samples)
    y_list.append(np.zeros(n_samples_per_class))
    
    # Aluminum Can samples
    alum_samples = np.random.normal(loc=[0.98, 2.70, 0.95, 0.01, 0.85], scale=[0.01, 0.08, 0.03, 0.01, 0.03], size=(n_samples_per_class, 5))
    X_list.append(alum_samples)
    y_list.append(np.ones(n_samples_per_class))
    
    # E-Waste Circuit Board samples
    ewaste_samples = np.random.normal(loc=[0.45, 3.50, 0.80, 0.05, 0.60], scale=[0.04, 0.15, 0.05, 0.02, 0.04], size=(n_samples_per_class, 5))
    X_list.append(ewaste_samples)
    y_list.append(np.full(n_samples_per_class, 2))
    
    # Cardboard Box samples
    cardboard_samples = np.random.normal(loc=[0.65, 0.70, 0.02, 0.08, 0.40], scale=[0.03, 0.04, 0.01, 0.02, 0.03], size=(n_samples_per_class, 5))
    X_list.append(cardboard_samples)
    y_list.append(np.full(n_samples_per_class, 3))
    
    # Organic Food Waste samples
    organic_samples = np.random.normal(loc=[0.20, 0.95, 0.01, 0.65, 0.30], scale=[0.04, 0.06, 0.01, 0.08, 0.04], size=(n_samples_per_class, 5))
    X_list.append(organic_samples)
    y_list.append(np.full(n_samples_per_class, 4))
    
    X = np.vstack(X_list)
    y = np.concatenate(y_list)
    
    # Train Random Forest Classifier
    clf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    clf.fit(X, y)
    
    y_pred = clf.predict(X)
    acc = accuracy_score(y, y_pred)
    print(f"Model Training Complete. Training Accuracy: {acc * 100:.2f}%")
    
    model_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, "waste_classifier_v1.pkl")
    
    metadata = {
        "model": clf,
        "feature_names": ["nir_reflectance", "density", "metallic_capacitance", "moisture", "xray_attenuation"],
        "class_names": ["pet_bottle", "aluminum_can", "ewaste", "cardboard", "organic"],
        "accuracy": acc
    }
    
    joblib.dump(metadata, model_path)
    print(f"Serialized model saved successfully to: {model_path}")

if __name__ == "__main__":
    train_and_serialize()
