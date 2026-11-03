import os
import secrets
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from uuid import UUID, uuid4

import bcrypt
from fastapi import Depends, FastAPI, HTTPException
from redis.asyncio import Redis
from redis.exceptions import RedisError
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import (
    ACCESS_TOKEN_EXPIRE_SECONDS,
    create_access_token,
    get_authenticated_client_id,
    validate_env_client_credentials,
)
from app.database import get_db
from app.schemas import (
    ClientDetailsResponse,
    ClientListItem,
    InitRequest,
    InitResponse,
    TokenRequest,
    TokenResponse,
    TransactionsInitResponse,
)



@asynccontextmanager
async def lifespan(app: FastAPI):
    redis_url = os.getenv("REDIS_URL")
    if not redis_url:
        raise RuntimeError("REDIS_URL must be configured")
    app.state.redis = Redis.from_url(redis_url)
    try:
        yield
    finally:
        await app.state.redis.close()
app = FastAPI(lifespan=lifespan)

def get_redis() -> Redis:
    return app.state.redis

@app.post(
        "/api/v1/auth/token",
        response_model=TokenResponse,
)
async def issue_access_token(data: TokenRequest):

    if not validate_env_client_credentials(
        data.client_id,
        data.client_secret,
    ):
        raise HTTPException(
            status_code = 401,
            detail = "Invalid client credentials",
            headers={"WWW-Authenticate": "Bearer"},

        )
    return TokenResponse(
        access_token = create_access_token(data.client_id),
        expires_in = ACCESS_TOKEN_EXPIRE_SECONDS,
    )
@app.post(
        "/api/v1/transaction/init",
        response_model=TransactionsInitResponse,
        status_code=201,
)
async def initialize_transaction(
    client_id: str = Depends(get_authenticated_client_id),
    redis: Redis = Depends(get_redis),
):
    transaction_id = uuid4()
    transaction_key = f"registration_transaction:{transaction_id}"
    transaction_ttl_seconds = int(
        os.getenv("TRANSACTION_TTL_SECONDS", "600")
    )
    transaction = {
        "client_id": client_id,
        "status": "INITIALIZED",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    try:
        await redis.hset(transaction_key, mapping= transaction)
        await redis.expire(transaction_key, transaction_ttl_seconds)
    except RedisError:
        raise HTTPException(
            status_code=503,
            detail= "Transaction Service Unavailable",

        ) from None
    return TransactionsInitResponse(
        transaction_id=transaction_id,
        status= "INITIALIZED",
    )













async def register_client(
    db: AsyncSession,
    data: InitRequest,
    transaction_id
):
    result = await db.execute(
        text("""
            SELECT transaction_id
            FROM registration_transation
            WHERE transaction_id = CAST(:transaction_id AS UUID)
              AND status = 'PENDING'
              AND expires_at > NOW()
        """),
        {"transaction_id": str(transaction_id)}
    )
    transaction = result.scalar_one_or_none()
    if transaction is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired transaction"
        )
    client_id = "client_" + uuid4().hex
    client_secret = secrets.token_urlsafe(32)
    hashed_secret = bcrypt.hashpw(
        client_secret.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")
    await db.execute(
        text("""
            INSERT INTO client_request
                (client_id, client_name, redirect_urls, client_secret, transaction_id)
            VALUES
                (:client_id, :client_name, :redirect_urls, :client_secret, CAST(:transaction_id AS UUID))
        """),
        {
            "client_id": client_id,
            "client_name": data.client_name,
            "redirect_urls": data.redirect_urls,
            "client_secret": hashed_secret,
            "transaction_id": str(transaction_id),
        }
    )
    await db.execute(
        text("""
            UPDATE registration_transation
            SET status = 'COMPLETED',
                completed_at = NOW()
            WHERE transaction_id = CAST(:transaction_id AS UUID)
        """),
        {"transaction_id": str(transaction_id)}
    )
    return client_id, client_secret
    
@app.post(
    "/api/v1/init",
    response_model=InitResponse,
    status_code=201
)
async def init_client(
    data: InitRequest,
    db: AsyncSession = Depends(get_db)
):
    async with db.begin():
        result = await db.execute(
            text("""
                INSERT INTO registration_transation
                    (expires_at)
                VALUES
                    (NOW() + INTERVAL '10 minutes')
                RETURNING transaction_id
            """)
        )
        transaction_id = result.scalar_one()
        client_id, client_secret = await register_client(
            db,
            data,
            transaction_id
        )
    return InitResponse(
        transaction_id=transaction_id,
        client_id=client_id,
        client_secret=client_secret,
        status="COMPLETED"
    )


@app.get(
    "/api/v1/clients",
    response_model=list[ClientListItem],
)
async def list_clients(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        text("""
            SELECT client_id, client_name, redirect_urls, date
            FROM client_request
            ORDER BY date DESC
        """)
    )
    return [
        ClientListItem(
            client_id=row["client_id"],
            client_name=row["client_name"],
            redirect_urls=row["redirect_urls"],
            date=row["date"],
        )
        for row in result.mappings().all()
    ]


@app.get(
    "/api/v1/clients/{client_id}",
    response_model=ClientDetailsResponse,
)
async def get_client_by_id(
    client_id: str,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        text("""
            SELECT client_name, redirect_urls
            FROM client_request
            WHERE client_id = :client_id
        """),
        {"client_id": client_id},
    )
    row = result.mappings().one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return ClientDetailsResponse(
        client_name=row["client_name"],
        redirect_urls=row["redirect_urls"],
    )