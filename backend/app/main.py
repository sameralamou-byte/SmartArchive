"""
SmartArchive backend entrypoint — Milestone 1 (Foundation).
No business features (OCR/AI/connectors) are mounted here. See README.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.logging import configure_logging, logging_middleware
from app.routers.v1.router import api_router

configure_logging()

app = FastAPI(
    title="SmartArchive AI Platform",
    description="Enterprise AI Document Intelligence Platform — API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.middleware("http")(logging_middleware)

app.include_router(api_router, prefix="/api/v1")
