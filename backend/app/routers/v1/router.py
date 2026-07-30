"""Aggregates every v1 router. main.py mounts only this, at prefix /api/v1."""
from fastapi import APIRouter

from app.routers.v1 import auth, health, users

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(users.router)
