FROM python:3.9-slim

COPY ./src /app/src
COPY ./requirements.txt /app

WORKDIR /app

RUN pip3 install -r requirements.txt

WORKDIR /app/src

EXPOSE 8000


CMD ["uvicorn", "main:app", "--host=0.0.0.0"]
