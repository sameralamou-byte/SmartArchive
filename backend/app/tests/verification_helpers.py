from http.cookies import SimpleCookie
from urllib.parse import parse_qs, urlparse

from app.mailer.sender import get_memory_sender


def raw_token_from_mailbox(email: str | None = None) -> str:
    messages = list(get_memory_sender().messages)
    if email is not None:
        messages = [message for message in messages if message.to == email]
    assert messages, "no verification email captured"
    text = messages[-1].text_body
    for line in text.splitlines():
        if "token=" in line:
            return parse_qs(urlparse(line.strip()).query)["token"][0]
    raise AssertionError("no token in mail body")


def sa_refresh_from(response) -> str | None:
    headers = []
    get_list = getattr(response.headers, "get_list", None)
    if callable(get_list):
        headers.extend(get_list("set-cookie") or [])
        headers.extend(get_list("Set-Cookie") or [])
    single = response.headers.get("set-cookie") or response.headers.get("Set-Cookie")
    if single and single not in headers:
        headers.append(single)
    for raw in headers:
        parsed = SimpleCookie()
        parsed.load(raw)
        if "sa_refresh" in parsed:
            return parsed["sa_refresh"].value
    if "sa_refresh" in response.cookies:
        return response.cookies["sa_refresh"]
    return None


def set_cookie_headers(response) -> list[str]:
    headers: list[str] = []
    get_list = getattr(response.headers, "get_list", None)
    if callable(get_list):
        headers.extend(get_list("set-cookie") or [])
        headers.extend(get_list("Set-Cookie") or [])
    single = response.headers.get("set-cookie") or response.headers.get("Set-Cookie")
    if single and single not in headers:
        headers.append(single)
    return headers


def sa_refresh_set_cookie_header(response) -> str:
    for raw in set_cookie_headers(response):
        if "sa_refresh" in raw.lower():
            return raw
    return ""


def assert_sa_refresh_cookie_attributes(response) -> str:
    header = sa_refresh_set_cookie_header(response)
    assert header, "expected Set-Cookie for sa_refresh"
    lower = header.lower()
    assert "sa_refresh=" in lower
    assert "httponly" in lower
    assert "secure" in lower
    assert "samesite=none" in lower
    assert "path=/api/v1/auth" in lower
    assert "domain=" not in lower
    return header
