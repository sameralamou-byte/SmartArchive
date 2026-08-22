class EmailNotVerifiedError(Exception):
    """Account exists and credentials may be valid, but mailbox is not proven."""

    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(message)
