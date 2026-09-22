"""Auth exception types shared by HSA and ESA services."""


class AuthenticationError(Exception):
    pass


class VerifyEmailError(Exception):
    pass


class PasswordResetInvalidError(Exception):
    pass


class PasswordPolicyError(Exception):
    def __init__(self, detail: str, missing: list[str] | None = None) -> None:
        self.detail = detail
        self.missing = missing or []
        super().__init__(detail)


class RefreshReuseError(Exception):
    pass
