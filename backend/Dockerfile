FROM ubuntu:latest
LABEL authors="Alex"

FROM python:3-alpine
WORKDIR /backend
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
ENV PYTHONUNBUFFERED 1
COPY backend ./backend
COPY main ./main
COPY entrypoint.sh .
COPY manage.py .