import os
import secrets
from datetime import datetime, timedelta, timezone
import uuid
from uuid import uuid4

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

JWT_ALGORITHM = "HS256"
JWT_ISSUER= "nic-api"
JWT_AUDIENCE = "nic-registration"
ACCESS_TOKEN_EXPIRE_SECONDS = 15 * 60

bearer_scheme = HTTPBearer(auto_error=False)

def _required_settings(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"{name} must be configured")
    return value

def create_access_token(client_id: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": client_id,
        "iss": JWT_ISSUER,
        "aud": JWT_AUDIENCE,
        "iat": now,
        "exp": now + timedelta(seconds=ACCESS_TOKEN_EXPIRE_SECONDS),
        "jti": str(uuid4()),
    }
    return jwt.encode(
        payload,
        _required_settings("JWT_SECRET"),
        algorithm= JWT_ALGORITHM,
    )
def validate_env_client_credentials(
        client_id: str,
        client_secret: str,

) -> bool:
    configured_id = _required_settings("API_AUTH_CLIENT_ID")
    configured_secret = _required_settings("API_AUTH_CLIENT_SECRET")

    # constant-time comparison to prevent timing attacks
    return(
        secrets.compare_digest(client_id, configured_id)
        and secrets.compare_digest(client_secret, configured_secret)
    )
async def get_authenticated_client_id(
        credentials: HTTPAuthorizationCredentials  | None = Depends(bearer_scheme),
) -> str:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail = "Bearer token required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        claims = jwt.decode(
            credentials.credentials,
            _required_settings("JWT_SECRET"),
            algorithms=[JWT_ALGORITHM],
            audience=JWT_AUDIENCE,
            issuer=JWT_ISSUER,
        )
        client_id = claims["sub"]
    except (jwt.PyJWTError, KeyError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from None
    return client_id