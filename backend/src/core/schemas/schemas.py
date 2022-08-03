import pydantic as _pydantic
from pydantic import BaseModel

# -------------------------------------------------------------------
# DATABASE SCHEMAS
# -------------------------------------------------------------------

class Ticker(_pydantic.BaseModel):
    id: int
    name: str
    funds: dict
    price: int
    type: str
    
    class Config:
        orm_mode = True

class createTicker(_pydantic.BaseModel):
    name: str
    funds: dict
    price: int
    type: str

class Fondo(_pydantic.BaseModel):
    id: int
    name: str
    tickers: dict
    patrimony: int
    type: str

    class Config:
        orm_mode = True

# -------------------------------------------------------------------
# BASIC SCHEMAS
# -------------------------------------------------------------------

class ticker_in_FCI_SCH(BaseModel):
    ticker: str
    fci: str
    