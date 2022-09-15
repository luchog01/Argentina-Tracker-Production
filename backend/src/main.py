from unicodedata import name
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import JSON
import core.schemas.schemas as _schemas
import core.services.services as _services
import sqlalchemy.orm as _orm
from typing import Dict, List
import uvicorn
from settings import ENGINE_PSWD
from datetime import datetime

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://52.200.228.178:3000",
    "http://fcitracker.online"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

# FIX Security Breach
# @app.post("/createTicker", response_model=_schemas.Ticker)
# async def createTicker(ticker: _schemas.createTicker, db: _orm.Session = Depends(_services.get_db)):
#     db_ticker = _services.get_ticker_by_name(db=db, name=ticker.name)
#     if db_ticker:
#         raise HTTPException(
#             status_code=400, detail="Ticker already in Database."
#         )
#     return _services.create_ticker(db=db, ticker=ticker)


@app.get("/tickers/")
def read_users(
    db: _orm.Session = Depends(_services.get_db),
):
    tickers = _services.get_tickers(db=db)
    response = {}
    for ticker in tickers:
        response[ticker.id] = ticker.name
    return response


@app.get("/tickers/{ticker_id}", response_model=_schemas.Ticker)
def tickers(ticker_id: int, db: _orm.Session = Depends(_services.get_db)):
    db_ticker = _services.get_ticker(db=db, id=ticker_id)
    if db_ticker is None:
        raise HTTPException(
            status_code=404, detail="This Ticker does not exist."
        )
    return db_ticker

@app.get("/point/{ticker_id}/{date}", response_model=Dict)
def point(ticker_id: int, date: str, db: _orm.Session = Depends(_services.get_db)):
    db_ticker = tickers(ticker_id=ticker_id, db=db)
    resp = {"date": date, "price": 0.0, "name": db_ticker.name, "total": 0.0, "avg": 0.0, "funds": {}}
    for fund in db_ticker.funds.keys():
        try:
            ind: int = db_ticker.funds[fund]["dates"].index(date)
            resp["funds"][fund] = round(db_ticker.funds[fund]["qty"][ind], 2)
            if resp["price"] == 0.0:
                resp["price"] =  round(db_ticker.funds[fund]["prices"][ind], 2)
            
        except:
            pass

    resp["total"] = resp["funds"]["total"]
    resp["avg"] = resp["funds"]["avg"]
    resp["funds"].pop('total', None)
    resp["funds"].pop('avg', None)

    return resp

@app.get("/compare/{ticker_id}/{date1}/{date2}", response_model=Dict)
def compare(ticker_id: int, date1: str, date2: str, db: _orm.Session = Depends(_services.get_db)):
    resp1: dict = point(ticker_id=ticker_id, date=date1,db=db)
    resp2: dict = point(ticker_id=ticker_id, date=date2,db=db)

    dif = {
        "date":date1 + " - " + date2,
        "price":resp2["price"],
        "name":resp2["name"],
        "table":[]
        }
    
    dif["table"].append(["Fund", date1, date2, "Qty Delta", "% Delta"])
    dif["table"].append(["total", resp1["total"], resp2["total"], round(resp2["total"]-resp1["total"],2), round(((resp2["total"]-resp1["total"]) * 100)/ resp1["total"], 2)])
    dif["table"].append(["avg", resp1["avg"], resp2["avg"], round(resp2["avg"]-resp1["avg"], 2), round(((resp2["avg"]-resp1["avg"]) * 100)/ resp1["avg"], 2)])
    for key in resp2["funds"].keys():
        if key in resp1["funds"].keys():
            dif_qty: float = round(resp2["funds"][key] - resp1["funds"][key],2)
            dif_per: float = round((dif_qty*100)/resp1["funds"][key],2)
            dif["table"].append([key, resp1["funds"][key], resp2["funds"][key], dif_qty, dif_per])
        
        else:
            dif["table"].append([key, 0, resp2["funds"][key], resp2["funds"][key], 100])
    
    return dif


@app.post("/engineUpdate/{password}/{today}")
async def update_engine(password: str,today: str, request: Request, db: _orm.Session = Depends(_services.get_db)):
    try:
        if password == ENGINE_PSWD:
            payload = await request.json()
            for t in payload.keys():
                db_ticker = _services.get_ticker_by_name(db=db, name=t)
                if db_ticker:
                    new_fund: dict = db_ticker.funds
                    for f in payload[t].keys():
                        if f in new_fund.keys():
                            if today != new_fund[f]["dates"][-1]:
                                new_fund[f]["dates"].append(today)
                                new_fund[f]["qty"].append(payload[t][f]["qty"])
                                new_fund[f]["prices"].append(payload[t][f]["price"])
                            else:
                                new_fund[f]["qty"][-1] = payload[t][f]["qty"]
                                new_fund[f]["prices"][-1] = payload[t][f]["price"]
                        else:
                            new_fund[f] = {"dates": [today], "qty": [payload[t][f]["qty"]], "prices": [payload[t][f]["price"]]}
                    _services.update_ticker(db=db, ticker=_schemas.createTicker(name=t,funds=new_fund,price=0,type="basic"))                
                else:
                    new_fund: dict = {}
                    for f in payload[t].keys():
                        new_fund[f] = {"dates": [today], "qty": [payload[t][f]["qty"]], "prices": [payload[t][f]["price"]]}
                    _services.create_ticker(db=db, ticker=_schemas.createTicker(name=t,funds=new_fund,price=0,type="basic"))
        else:
            raise HTTPException(
                status_code=403, detail="Incorrect Password."
            )
    except Exception as e:
        print("[ERROR] engineUpdate: ",e)
        raise HTTPException(
                status_code=500, detail="Internal Server Error"
            )    
# -------------------------------------------------------------------
# PLAYGROUND
# -------------------------------------------------------------------

# -------------------------------------------------------------------
# RUN
# -------------------------------------------------------------------

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, loop="asyncio")