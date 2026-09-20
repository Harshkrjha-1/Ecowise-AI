"""
FastAPI Router for IBM Granite RAG Engine endpoints
"""

from fastapi import APIRouter, Query
from app.rag.granite_rag import granite_rag_engine

router = APIRouter(prefix="/rag", tags=["IBM Granite RAG"])

@router.get("/citation")
def get_citation(preset: str = Query("pet_bottle")):
    return granite_rag_engine.retrieve_citation(preset)

@router.get("/search")
def search_knowledge_base(query: str = Query("")):
    return {
        "query": query,
        "results": granite_rag_engine.search_knowledge_base(query)
    }
