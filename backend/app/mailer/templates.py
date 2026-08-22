TEMPLATES: dict[str, tuple[str, str]] = {
    "en": (
        "Confirm your SmartArchive email",
        "Please confirm the email for your SmartArchive account.\n\n"
        "{url}\n\nThis link expires in 24 hours.\n",
    ),
    "de": (
        "Bestätigen Sie Ihre SmartArchive-E-Mail",
        "Bitte bestätigen Sie die E-Mail für Ihr SmartArchive-Konto.\n\n"
        "{url}\n\nDieser Link läuft in 24 Stunden ab.\n",
    ),
    "ar": (
        "Confirm your SmartArchive email",
        "Please confirm the email for your SmartArchive account.\n\n"
        "{url}\n\nThis link expires in 24 hours.\n",
    ),
}


def locale_from_accept_language(header: str | None) -> str:
    if not header:
        return "en"
    first = header.split(",")[0].strip().lower()
    if first.startswith("de"):
        return "de"
    if first.startswith("ar"):
        return "ar"
    return "en"


def render_verification_email(locale: str, verify_url: str) -> tuple[str, str]:
    subject, body = TEMPLATES.get(locale, TEMPLATES["en"])
    return subject, body.format(url=verify_url)


RESET_SUBJECT = "Reset your SmartArchive password"
RESET_BODY = (
    "Use the link below to set a new password for your SmartArchive account.\n\n"
    "{url}\n\n"
    "This link expires in 1 hour.\n\n"
    "If you did not ask to reset your password, you can ignore this message.\n\n"
    "This message does not mean the address is registered.\n\n"
    "Setting a new password does not confirm your email — you must still confirm "
    "your mailbox before signing in.\n"
)


def render_password_reset_email(reset_url: str) -> tuple[str, str]:
    return RESET_SUBJECT, RESET_BODY.format(url=reset_url)
