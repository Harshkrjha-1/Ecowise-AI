from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.api import auth, telemetry, scanner, analytics, agent, rag
from app.models.user import User, UserRole
from app.services.auth_service import get_password_hash

# Create tables automatically on startup
Base.metadata.create_all(bind=engine)

# Seed default users
def seed_default_users():
    db = SessionLocal()
    try:
        operator = db.query(User).filter(User.email == "operator@ecowise.ai").first()
        if not operator:
            op_user = User(
                email="operator@ecowise.ai",
                hashed_password=get_password_hash("admin123"),
                full_name="Dr. Sarah Jenkins (Operator)",
                role=UserRole.ADMIN,
                department="Campus Operations & Energy",
                eco_points=1250,
                is_active=True
            )
            db.add(op_user)

        student = db.query(User).filter(User.email == "student@ecowise.ai").first()
        if not student:
            st_user = User(
                email="student@ecowise.ai",
                hashed_password=get_password_hash("student123"),
                full_name="Alex Rivera (Student)",
                role=UserRole.STUDENT,
                department="Environmental Engineering",
                eco_points=340,
                is_active=True
            )
            db.add(st_user)

        db.commit()
    except Exception as e:
        print("Error seeding default users:", e)
        db.rollback()
    finally:
        db.close()

seed_default_users()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Agentic AI for Sustainable Campus Resource & Waste Intelligence (SDG 12, 11, 13, 4)",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Set CORS origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(telemetry.router, prefix=settings.API_V1_STR)
app.include_router(scanner.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(agent.router, prefix=settings.API_V1_STR)
app.include_router(rag.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "title": settings.PROJECT_NAME,
        "status": "online",
        "engines": ["Scikit-Learn ML Classifier", "IBM Granite 3.0 RAG", "IBM Bob Agent", "Resource Forecaster"],
        "sdgs": ["SDG 12", "SDG 11", "SDG 13", "SDG 4"],
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get(f"{settings.API_V1_STR}/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "ml_classifier": "ready",
        "ibm_granite_rag": "ready",
        "version": "1.0.0"
    }
