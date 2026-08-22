from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str
    organization_name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False
    organization_slug: str | None = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class VerifyEmailRequest(BaseModel):
    token: str


class ResendVerificationRequest(BaseModel):
    email: EmailStr


class VerifyEmailResponse(BaseModel):
    email_verified: bool


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    password: str
    password_confirm: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    new_password_confirm: str


class MessageResponse(BaseModel):
    detail: str
