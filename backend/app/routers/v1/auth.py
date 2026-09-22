from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.rate_limit import (
    FORGOT_ACCEPTED_DETAIL,
    RESEND_ACCEPTED_DETAIL,
    forgot_password_should_suppress,
    resend_should_suppress,
)
from app.models.user import User
from app.schemas.auth import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    ResendVerificationRequest,
    ResetPasswordRequest,
    TokenResponse,
    VerifyEmailRequest,
    VerifyEmailResponse,
)
from app.schemas.user import UserRead, to_user_read
from app.security.origin import require_allowed_origin
from app.security.refresh_cookie import REFRESH_COOKIE_NAME, clear_refresh_cookie, set_refresh_cookie
from app.services.auth_service import (
    AuthenticationError,
    AuthService,
    PasswordPolicyError,
    PasswordResetInvalidError,
    RefreshReuseError,
    VerifyEmailError,
)

router = APIRouter(prefix="/auth", tags=["auth"])


async def _json_object(request: Request) -> dict:
    if request.headers.get("content-length") in (None, "0"):
        return {}
    try:
        payload = await request.json()
    except Exception:
        return {}
    return payload if isinstance(payload, dict) else {}


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(
    data: RegisterRequest,
    request: Request,
    session: AsyncSession = Depends(get_db),
) -> UserRead:
    service = AuthService(session)
    try:
        user = await service.register(data, request.headers.get("accept-language"))
    except AuthenticationError as exc:
        raise HTTPException(status.HTTP_409_CONFLICT, str(exc)) from exc
    except PasswordPolicyError as exc:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, exc.detail) from exc
    return to_user_read(user=user, email_verified=False)


@router.post("/login", response_model=TokenResponse)
async def login(
    data: LoginRequest,
    response: Response,
    session: AsyncSession = Depends(get_db),
) -> TokenResponse:
    service = AuthService(session)
    try:
        access, raw_refresh, remember_me = await service.authenticate(data)
    except AuthenticationError as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, str(exc)) from exc
    set_refresh_cookie(response, raw_refresh, remember_me)
    return TokenResponse(access_token=access)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    request: Request,
    response: Response,
    session: AsyncSession = Depends(get_db),
) -> TokenResponse:
    require_allowed_origin(request)
    body = await _json_object(request)
    if body.get("refresh_token") is not None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")
    raw = request.cookies.get(REFRESH_COOKIE_NAME)
    service = AuthService(session)
    try:
        access, new_raw, remember_me = await service.refresh_from_cookie(raw or "")
    except RefreshReuseError as exc:
        clear_refresh_cookie(response)
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, str(exc)) from exc
    except AuthenticationError as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, str(exc)) from exc
    set_refresh_cookie(response, new_raw, remember_me)
    return TokenResponse(access_token=access)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    request: Request,
    response: Response,
    session: AsyncSession = Depends(get_db),
) -> None:
    require_allowed_origin(request)
    raw = request.cookies.get(REFRESH_COOKIE_NAME)
    service = AuthService(session)
    await service.logout_from_cookie(raw)
    clear_refresh_cookie(response)


@router.post("/forgot-password", status_code=status.HTTP_202_ACCEPTED)
async def forgot_password(
    data: ForgotPasswordRequest,
    request: Request,
    session: AsyncSession = Depends(get_db),
) -> JSONResponse:
    body = {"detail": FORGOT_ACCEPTED_DETAIL}
    client_ip = request.client.host if request.client else "unknown"
    suppress = await forgot_password_should_suppress(str(data.email), client_ip)
    if not suppress:
        service = AuthService(session)
        try:
            await service.forgot_password(str(data.email))
        except Exception:
            pass
    return JSONResponse(status_code=status.HTTP_202_ACCEPTED, content=body)


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(
    data: ResetPasswordRequest,
    session: AsyncSession = Depends(get_db),
) -> MessageResponse:
    service = AuthService(session)
    try:
        await service.reset_password(data)
    except PasswordResetInvalidError as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(exc)) from exc
    except PasswordPolicyError as exc:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, exc.detail) from exc
    return MessageResponse(detail="Password updated.")


@router.post("/change-password", response_model=MessageResponse)
async def change_password(
    data: ChangePasswordRequest,
    response: Response,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> MessageResponse:
    service = AuthService(session)
    try:
        await service.change_password(user, data)
    except AuthenticationError as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, str(exc)) from exc
    except PasswordPolicyError as exc:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, exc.detail) from exc
    clear_refresh_cookie(response)
    return MessageResponse(detail="Password updated.")


@router.post("/verify-email", response_model=VerifyEmailResponse)
async def verify_email(
    data: VerifyEmailRequest, session: AsyncSession = Depends(get_db)
) -> VerifyEmailResponse:
    service = AuthService(session)
    try:
        await service.verify_email(data.token)
    except VerifyEmailError as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(exc)) from exc
    return VerifyEmailResponse(email_verified=True)


@router.post("/resend-verification", status_code=status.HTTP_202_ACCEPTED)
async def resend_verification(
    data: ResendVerificationRequest,
    request: Request,
    session: AsyncSession = Depends(get_db),
) -> JSONResponse:
    body = {"detail": RESEND_ACCEPTED_DETAIL}
    client_ip = request.client.host if request.client else "unknown"
    if await resend_should_suppress(str(data.email), client_ip):
        return JSONResponse(status_code=status.HTTP_202_ACCEPTED, content=body)
    service = AuthService(session)
    try:
        await service.resend_verification(str(data.email), request.headers.get("accept-language"))
    except Exception:
        pass
    return JSONResponse(status_code=status.HTTP_202_ACCEPTED, content=body)
