import sqlalchemy.orm as _orm

from ..models import models as _models
from ..schemas import schemas as _schemas
from ..database import database as _database
from typing import List


def create_database():
    return _database.Base.metadata.create_all(bind=_database.engine)


def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_ticker(db: _orm.Session, id: int):
    return db.query(_models.Ticker).filter(_models.Ticker.id == id).first()


def get_ticker_by_name(db: _orm.Session, name: str):
    return db.query(_models.Ticker).filter(_models.Ticker.name == name).first()


def get_tickers(db: _orm.Session) -> List[_models.Ticker]:
    return db.query(_models.Ticker).all()


def create_ticker(db: _orm.Session, ticker: _schemas.createTicker):
    db_user = _models.Ticker(name=ticker.name, funds=ticker.funds, price=ticker.price, type=ticker.type)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_ticker(db: _orm.Session, ticker: _schemas.createTicker):
    db.query(_models.Ticker).filter(_models.Ticker.name == ticker.name).update({'funds': ticker.funds, 'price': ticker.price, 'type': ticker.type})
    db.commit()


# FIX Here we need to replace post to funds Database

# def get_posts(db: _orm.Session, skip: int = 0, limit: int = 10):
#     return db.query(_models.Post).offset(skip).limit(limit).all()


# def create_post(db: _orm.Session, post: _schemas.PostCreate, user_id: int):
#     post = _models.Post(**post.dict(), owner_id=user_id)
#     db.add(post)
#     db.commit()
#     db.refresh(post)
#     return post


# def get_post(db: _orm.Session, post_id: int):
#     return db.query(_models.Post).filter(_models.Post.id == post_id).first()


# def delete_post(db: _orm.Session, post_id: int):
#     db.query(_models.Post).filter(_models.Post.id == post_id).delete()
#     db.commit()


# def update_post(db: _orm.Session, post_id: int, post: _schemas.PostCreate):
#     db_post = get_post(db=db, post_id=post_id)
#     db_post.title = post.title
#     db_post.content = post.content
#     db.commit()
#     db.refresh(db_post)
#     return db_post