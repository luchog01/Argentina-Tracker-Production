from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import core.schemas.schemas as _schemas
import core.services.services as _services
import sqlalchemy.orm as _orm
from typing import Dict
import uvicorn
from settings import ENGINE_PSWD
from excel_handler import handler as ExcelHandler
from fastapi.responses import FileResponse

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

@app.get("/excel/{ticker_id}", response_class=FileResponse)
def excel(ticker_id: int, db: _orm.Session = Depends(_services.get_db)):
    db_ticker = tickers(ticker_id=ticker_id, db=db)
    some_file_path = ExcelHandler.get_excel(db_ticker.name)
    return FileResponse(some_file_path, filename=f"{db_ticker.name}.xlsx")

@app.get("/point/{ticker_id}/{date}", response_model=Dict)
def point(ticker_id: int, date: str, db: _orm.Session = Depends(_services.get_db)):
    db_ticker = tickers(ticker_id=ticker_id, db=db)
    resp = {"date": date, "price": 0.0, "name": db_ticker.name, "funds": []}

    # Add total and avg at the beginning of the table
    first_keys = ["total", "avg"]
    for key in first_keys:
        ind: int = db_ticker.funds[key]["dates"].index(date)
        resp["funds"].append([key, round(db_ticker.funds[key]["qty"][ind], 2)])
        if resp["price"] == 0.0:
            resp["price"] =  round(db_ticker.funds[key]["prices"][ind], 2)
        db_ticker.funds.pop(key)

    for fund in db_ticker.funds.keys():
        try:
            ind: int = db_ticker.funds[fund]["dates"].index(date)
            resp["funds"].append([fund, round(db_ticker.funds[fund]["qty"][ind], 2)])
            if resp["price"] == 0.0:
                resp["price"] =  round(db_ticker.funds[fund]["prices"][ind], 2)
            
        except Exception as e:
            print(f"[WARNING] /point fund name: {fund} error: {str(e)}")
            pass

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

   
    # Convert funds to dicts
    resp1_funds_dict: dict = {}
    for fund in resp1["funds"]:
        resp1_funds_dict[fund[0]] = fund[1]
    
    resp2_funds_dict: dict = {}
    for fund in resp2["funds"]:
        resp2_funds_dict[fund[0]] = fund[1]

    # Get the rest of the funds
    for key in resp2_funds_dict:
        if key in resp1_funds_dict:
            dif_qty: float = round(resp2_funds_dict[key] - resp1_funds_dict[key],2)
            try:
                dif_per: float = round((dif_qty*100)/resp1_funds_dict[key],2)
            except:
                dif_per: float = 0
            dif["table"].append([key, resp1_funds_dict[key], resp2_funds_dict[key], dif_qty, dif_per])
        
        else:
            dif["table"].append([key, 0, resp2_funds_dict[key], resp2_funds_dict[key], 100])
    
    return dif


@app.post("/engineUpdate/{password}/{today}")
async def update_engine(password: str,today: str, request: Request, db: _orm.Session = Depends(_services.get_db)):
    try:
        if password == ENGINE_PSWD:
            payload = await request.json()
            ExcelHandler.update_excel(payload, today)
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
            return "Incorrect Password"
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