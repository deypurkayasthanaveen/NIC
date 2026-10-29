from datetime import date
from uuid import UUID
from pydantic import BaseModel

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
