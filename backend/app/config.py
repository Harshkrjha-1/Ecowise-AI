import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "EcoWise AI"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "ecowise-super-secret-key-change-in-production-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./ecowise.db")
    
    # IBM Granite / AI Settings
    GRANITE_API_KEY: str = os.getenv("GRANITE_API_KEY", "")
    GRANITE_API_URL: str = os.getenv("GRANITE_API_URL", "https://api.ibm.com/granite/v1")
    
    model_config = SettingsConfigDict(case_sensitive=True)

settings = Settings()

