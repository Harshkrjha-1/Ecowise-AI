from fastapi import APIRouter, Query

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary")
def get_analytics_summary(range: str = Query("weekly")):
    return {
        "date_range": range,
        "building_usage": [
            {"building": "Science Block", "electricity_kwh": 4200, "water_liters": 12500},
            {"building": "Engineering Hub", "electricity_kwh": 5100, "water_liters": 14200},
            {"building": "Library", "electricity_kwh": 2800, "water_liters": 8900},
            {"building": "Student Union", "electricity_kwh": 3400, "water_liters": 11000},
            {"building": "Dining Hall", "electricity_kwh": 6200, "water_liters": 21500},
        ],
        "material_purity": [
            {"name": "Plastics (PET/HDPE)", "value": 98.7, "color": "#10B981"},
            {"name": "Metals (Alum/Steel)", "value": 99.1, "color": "#06B6D4"},
            {"name": "Paper & Cardboard", "value": 97.4, "color": "#F59E0B"},
            {"name": "Contaminants", "value": 0.5, "color": "#EF4444"}
        ],
        "energy_breakdown": [
            {"category": "Sorting Pneumatics", "consumption": 42},
            {"category": "AI Compute Clusters", "consumption": 28},
            {"category": "Conveyor Motors", "consumption": 18},
            {"category": "HVAC & Lighting", "consumption": 12}
        ]
    }
