"""Transactional Account email verification sender. Not the tenant notifications table."""
from __future__ import annotations

import logging
import smtplib
from dataclasses import dataclass, field
from email.message import EmailMessage
from typing import Protocol

from app.core.config import settings

logger = logging.getLogger("smartarchive.mailer")


class EmailSender(Protocol):
    def send(self, to: str, subject: str, text_body: str, html_body: str | None) -> None: ...


class LogEmailSender:
    def send(self, to: str, subject: str, text_body: str, html_body: str | None) -> None:
        logger.info("verification email to=%s subject=%s\n%s", to, subject, text_body)


@dataclass
class MemoryMessage:
    to: str
    subject: str
    text_body: str
    html_body: str | None


@dataclass
class MemoryEmailSender:
    messages: list[MemoryMessage] = field(default_factory=list)

    def send(self, to: str, subject: str, text_body: str, html_body: str | None) -> None:
        self.messages.append(MemoryMessage(to=to, subject=subject, text_body=text_body, html_body=html_body))

    def clear(self) -> None:
        self.messages.clear()


class SmtpEmailSender:
    def send(self, to: str, subject: str, text_body: str, html_body: str | None) -> None:
        msg = EmailMessage()
        msg["From"] = settings.email_from
        msg["To"] = to
        msg["Subject"] = subject
        msg.set_content(text_body)
        if html_body:
            msg.add_alternative(html_body, subtype="html")
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as smtp:
            if settings.smtp_use_tls:
                smtp.starttls()
            if settings.smtp_user:
                smtp.login(settings.smtp_user, settings.smtp_password)
            smtp.send_message(msg)
        logger.info("verification email sent via smtp to=%s", to)


_memory_sender: MemoryEmailSender | None = None


def get_memory_sender() -> MemoryEmailSender:
    global _memory_sender
    if _memory_sender is None:
        _memory_sender = MemoryEmailSender()
    return _memory_sender


def reset_memory_sender() -> MemoryEmailSender:
    global _memory_sender
    _memory_sender = MemoryEmailSender()
    return _memory_sender


def get_email_sender() -> EmailSender:
    mode = settings.email_delivery_mode.lower()
    if mode == "memory":
        return get_memory_sender()
    if mode == "smtp":
        return SmtpEmailSender()
    return LogEmailSender()
