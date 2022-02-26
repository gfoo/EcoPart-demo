FROM python:3.9
WORKDIR /code
COPY . /code/
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
ARG PORT=8000
ENV PORT=${PORT}
CMD [ "sh", "-c", "uvicorn main:app --workers 1 --host 0.0.0.0 --port ${PORT}" ]
