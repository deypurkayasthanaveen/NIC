from datetime import date
from uuid import UUID
from pydantic import BaseModel, Field
from typing import Literal
class InitRequest(BaseModel):
    client_name: str 
    redirect_urls: str 
class InitResponse(BaseModel):
    transaction_id: UUID
    client_id: str
    client_secret: str
    status: str
class ClientDetailsResponse(BaseModel):
    client_name: str
    redirect_urls: str
class ClientListItem(BaseModel):
    client_id: str
    client_name: str
    redirect_urls: str
    date: date
class TokenRequest(BaseModel):
    client_id: str = Field(min_length=1)

    client_secret: str = Field(min_length=1)
class TokenResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    expires_in: int
class TransactionsInitResponse(BaseModel):
    transaction_id: UUID
    status: Literal["INITIALIZED"]