"""
Async SQLAlchemy engine/session setup.

No synchronous database access is permitted anywhere in this codebase
(locked architecture decision — see documentation/SA-ARCH-001.md).
"""
import asyncio
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings


class Base(DeclarativeBase):
    """Base class for all ORM models."""


# Lazy, per-event-loop engine/sessionmaker -- NOT created once at import
# time. An AsyncEngine's connection pool holds real DBAPI connections tied
# to whatever event loop was running when they were opened; reusing that
# pool after the loop closes (e.g. a new loop per pytest test, even with
# session-scoped fixture config) raises "Event loop is closed" /
# "attached to a different loop" errors from deep inside asyncpg. In
# production this is a non-issue (one uvicorn process, one persistent
# loop), so this still behaves as a plain singleton there -- it only
# recreates the engine on an actual loop change, e.g. across test runs.
_engine: AsyncEngine | None = None
_session_factory: async_sessionmaker[AsyncSession] | None = None
_engine_loop: asyncio.AbstractEventLoop | None = None


def _get_session_factory() -> async_sessionmaker[AsyncSession]:
    global _engine, _session_factory, _engine_loop
    current_loop = asyncio.get_running_loop()
    if _session_factory is None or _engine_loop is not current_loop:
        _engine = create_async_engine(settings.database_url, echo=False, pool_pre_ping=True)
        _session_factory = async_sessionmaker(bind=_engine, expire_on_commit=False, class_=AsyncSession)
        _engine_loop = current_loop
    return _session_factory


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency yielding a request-scoped async session."""
    session_factory = _get_session_factory()
    async with session_factory() as session:
        yield session
