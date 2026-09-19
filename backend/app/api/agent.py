from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/agent", tags=["EcoAction Agent"])

class ActionWorkflowDecision(BaseModel):
    action_id: str
    status: str # "approved", "modified", "rejected"
    modified_kpi: str | None = None
    reason: str | None = None

CURRENT_ADVISORY = {
    "action_id": "ACT-8842",
    "timestamp": "2026-09-18T14:22:00Z",
    "severity": "HIGH_ALERT",
    "anomaly": {
        "title": "Unusual 32.9% plastic contamination spike detected in Science Block",
        "location": "Science Block Bin Cluster SB-04",
        "detected_at": "14:22 PM",
        "variance": "+32.9%"
    },
    "root_cause_analysis": "High volume of unseparated PET packaging and lab sample containers following Science Department Annual Technology Expo event.",
    "interventions": [
        "Reroute Robotic Sorting Arm #2 to High-Throughput Plastic Sorting protocol.",
        "Increase conveyor motor speed to 45 m/min for accelerated throughput.",
        "Deploy auxiliary optical bin sensors to Cluster SB-04 for real-time contamination tracking."
    ],
    "target_kpis": {
        "contamination_reduction": "Below 1.2%",
        "pet_recovery": "+140 kg PET recovered",
        "energy_efficiency": "Maintain >94% system efficiency"
    },
    "status": "pending_approval"
}

@router.get("/advisory")
def get_current_advisory():
    return CURRENT_ADVISORY

@router.post("/decision")
def post_advisory_decision(decision: ActionWorkflowDecision):
    CURRENT_ADVISORY["status"] = decision.status
    if decision.modified_kpi:
        CURRENT_ADVISORY["target_kpis"]["custom_note"] = decision.modified_kpi
    return {
        "message": f"Action plan successfully updated to '{decision.status}'.",
        "action_id": decision.action_id,
        "updated_advisory": CURRENT_ADVISORY
    }
