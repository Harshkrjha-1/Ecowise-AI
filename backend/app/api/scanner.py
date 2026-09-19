from fastapi import APIRouter, Query

router = APIRouter(prefix="/scanner", tags=["Scanner"])

PRESET_DETECTIONS = {
    "pet_bottle": {
        "item_name": "PET Plastic Bottle",
        "category": "Dry Recyclable Waste",
        "confidence": 0.94,
        "bounding_box": {"x": 22, "y": 18, "width": 54, "height": 62},
        "destination": "Bin B2 - High Density Polymer Processing. Route to Campus Recycling Facility Slot 4.",
        "ibm_granite_rag": {
            "ref_id": "GR-883",
            "citation": "Campus Circular Economy Guideline Sec 4.2 - Polyethylene Terephthalate Recycling Standards",
            "confidence_score": 0.962,
            "explanation": "Object classified as high-purity PET #1 (Polyethylene Terephthalate). Optical NIR spectral response matches food-grade beverage containers. Recommended action: Pneumatic flaking and pelletizing at Facility B."
        }
    },
    "aluminum_can": {
        "item_name": "Aluminum Beverage Can",
        "category": "Dry Recyclable Metals",
        "confidence": 0.98,
        "bounding_box": {"x": 28, "y": 25, "width": 44, "height": 50},
        "destination": "Bin M1 - Non-Ferrous Metals Bin. Direct melt & extrusion stream.",
        "ibm_granite_rag": {
            "ref_id": "GR-419",
            "citation": "Zero-Waste Campus Operations Standard ISO 14001:2024",
            "confidence_score": 0.989,
            "explanation": "Object identified as 3004-alloy Aluminum alloy can. Infinitely recyclable with 95% energy savings compared to primary extraction. Sent to metallic compaction unit."
        }
    },
    "ewaste": {
        "item_name": "E-Waste Circuit Board (PCB)",
        "category": "Hazardous E-Waste",
        "confidence": 0.96,
        "bounding_box": {"x": 15, "y": 15, "width": 70, "height": 65},
        "destination": "Vault E4 - Secure Hazardous Electronic Disposal & Precious Metal Recovery Hub.",
        "ibm_granite_rag": {
            "ref_id": "GR-905",
            "citation": "Campus Hazardous Waste Protocols & EPA Compliance Framework Art 7",
            "confidence_score": 0.975,
            "explanation": "Contains copper, tin, and trace precious metals. Hazardous solder present. Mandated quarantine in specialized electro-recycling container."
        }
    },
    "cardboard": {
        "item_name": "Corrugated Cardboard Box",
        "category": "Dry Recyclable Paper",
        "confidence": 0.92,
        "bounding_box": {"x": 10, "y": 12, "width": 80, "height": 75},
        "destination": "Bin P3 - Cellulose & Fibre Pulping Shredder.",
        "ibm_granite_rag": {
            "ref_id": "GR-112",
            "citation": "Sustainable Packaging & Paper Fiber Policy v3.1",
            "confidence_score": 0.938,
            "explanation": "Uncontaminated kraft paperboard detected. Moisture index within 8% normal limits. Suitable for high-yield hydropulping."
        }
    },
    "organic": {
        "item_name": "Compostable Food Waste",
        "category": "Organic Waste",
        "confidence": 0.95,
        "bounding_box": {"x": 20, "y": 20, "width": 60, "height": 58},
        "destination": "Digester O1 - Anaerobic Biogas & Campus Fertilizer Composter.",
        "ibm_granite_rag": {
            "ref_id": "GR-774",
            "citation": "Campus Biodigesters & Organic Loop Protocol",
            "confidence_score": 0.951,
            "explanation": "Nitrogen-rich organic matter detected. Direct intake into aerobic digester line #2 for 14-day rapid composting cycle."
        }
    }
}

@router.get("/analyze")
def analyze_preset(preset: str = Query("pet_bottle")):
    data = PRESET_DETECTIONS.get(preset, PRESET_DETECTIONS["pet_bottle"])
    return {
        "status": "success",
        "result": data
    }
