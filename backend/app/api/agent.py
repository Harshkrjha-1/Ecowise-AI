from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ibm_bob_agent import ibm_bob_agent

router = APIRouter(prefix="/agent", tags=["EcoAction & IBM Bob Agent"])

class ActionWorkflowDecision(BaseModel):
    action_id: str
    status: str  # "approved", "modified", "rejected"
    modified_kpi: str | None = None
    reason: str | None = None

@router.get("/advisory")
def get_current_advisory():
    return ibm_bob_agent.evaluate_anomaly()

@router.post("/decision")
def post_advisory_decision(decision: ActionWorkflowDecision):
    res = ibm_bob_agent.process_human_decision(
        action_id=decision.action_id,
        decision=decision.status,
        custom_kpi=decision.modified_kpi
    )
    return {
        "message": f"IBM Bob Agent action plan updated to '{decision.status}'.",
        "action_id": decision.action_id,
        "updated_advisory": ibm_bob_agent.evaluate_anomaly()
    }
