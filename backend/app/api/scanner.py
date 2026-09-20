from fastapi import APIRouter, Query
from app.ml.classifier import classifier_engine
from app.rag.granite_rag import granite_rag_engine

router = APIRouter(prefix="/scanner", tags=["Scanner & AI Vision"])

@router.get("/analyze")
def analyze_preset(preset: str = Query("pet_bottle")):
    ml_result = classifier_engine.predict_material(preset)
    rag_citation = granite_rag_engine.retrieve_citation(preset)
    
    return {
        "status": "success",
        "result": {
            **ml_result,
            "ibm_granite_rag": rag_citation
        }
    }
