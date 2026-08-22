import uuid

from pydantic import BaseModel, ConfigDict, EmailStr


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: EmailStr
    full_name: str
    is_active: bool
    organization_id: uuid.UUID
    email_verified: bool


def to_user_read(*, user, email_verified: bool) -> UserRead:
    return UserRead(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        organization_id=user.organization_id,
        email_verified=email_verified,
    )
