from fastapi import APIRouter
import random
import time

router = APIRouter(prefix="/telemetry", tags=["Telemetry"])

@router.get("/dashboard")
def get_dashboard_telemetry():
    now = time.strftime("%H:%M:%S")
    return {
        "timestamp": now,
        "efficiency": round(random.uniform(91.5, 98.5), 1),
        "energy_kwh": round(random.uniform(14.2, 18.8), 2),
        "conveyor_throughput": {
            "processed": random.randint(225, 238),
            "target": 300,
            "percentage": 76.6
        },
        "actuator_status": {
            "active_arms": 4,
            "total_arms": 4,
            "health_percentage": 95
        },
        "kpi": {
            "current_task": "Material Classification (Polymer Sort #3)",
            "total_waste_kg": 1245,
            "recyclable_percentage": 62,
            "anomaly_variance": 0.5
        },
        "performance_series": [
            {"time": "08:00", "efficiency": 92, "energy": 14.5},
            {"time": "10:00", "efficiency": 95, "energy": 16.2},
            {"time": "12:00", "efficiency": 94, "energy": 18.1},
            {"time": "14:00", "efficiency": 97, "energy": 15.8},
            {"time": "16:00", "efficiency": 96, "energy": 16.9},
            {"time": "18:00", "efficiency": 98, "energy": 14.8},
            {"time": "20:00", "efficiency": 95, "energy": 15.2}
        ]
    }
