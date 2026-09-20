from fastapi import APIRouter, Query
from app.services.resource_forecaster import resource_forecaster

router = APIRouter(prefix="/analytics", tags=["Analytics & ML Forecast"])

@router.get("/summary")
def get_analytics_summary(range: str = Query("weekly")):
    return resource_forecaster.get_building_analytics(range)
