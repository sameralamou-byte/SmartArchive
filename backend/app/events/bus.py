"""
Minimal in-process domain event bus.

Locked decision (SA-ARCH-001): business actions emit domain events instead
of services calling each other directly. This keeps the door open to swap
the in-process bus for Redis Streams / RabbitMQ / Kafka later without
touching any publisher or subscriber code — only this module changes.
"""
import asyncio
import logging
from collections import defaultdict
from collections.abc import Awaitable, Callable
from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Any

logger = logging.getLogger("smartarchive.events")

Handler = Callable[["Event"], Awaitable[None]]


@dataclass
class Event:
    name: str
    organization_id: str
    payload: dict[str, Any] = field(default_factory=dict)
    occurred_at: datetime = field(default_factory=lambda: datetime.now(UTC))


class EventBus:
    def __init__(self) -> None:
        self._subscribers: dict[str, list[Handler]] = defaultdict(list)

    def subscribe(self, event_name: str, handler: Handler) -> None:
        self._subscribers[event_name].append(handler)

    async def publish(self, event: Event) -> None:
        handlers = self._subscribers.get(event.name, [])
        if not handlers:
            logger.debug("event '%s' published with no subscribers", event.name)
            return
        await asyncio.gather(*(handler(event) for handler in handlers))


event_bus = EventBus()
