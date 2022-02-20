## Local dev

Create a .env file contaning dev configurations (empty database ready to use) :

```
#
# required
#
PROJECT_NAME="ecopart_demo"
SQLALCHEMY_DATABASE_URI="postgresql://postgres:postgres@localhost:5432/ecopart_demo"
SECRET_KEY="d613f7874dea70e21ccbac61247368b61c16247a2a4ed0a8a645aeb608d085e6"
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```

Create a python venv:

```shell
$ python3.9 -m venv .venv
$ source .venv/bin/activate
$ pip install -r requirements.txt
```

Init database:

```shell
$ alembic upgrade head
```

Launch API:

```shell
$ uvicorn main:app --reload
```

Doc : http://localhost:8000/docs

## Initialize base and data

(Data are prepared from [here](../data/README.md))

```shell
# re-init db
$ psql -U postgres -h localhost -c "drop database ecopart_demo"
$ psql -U postgres -h localhost -c "create database ecopart_demo"

# import all EcoPArt data into an empty base
$ python initial_data.py -d ../data/samples-data.json

# generate new mapping according to last models (if you change that)
$ alembic revision --autogenerate -m "bla bla"
```

## Build and run docker image

```shell
# build
$ docker build -t ecopart-backend .

# launch
$ docker run --rm -v ${PWD}/../data:/data -d --name ecopart-backend \
    --network=host \
    -e PROJECT_NAME="ecopart_api_demo" \
    -e SQLALCHEMY_DATABASE_URI="postgresql://postgres:postgres@localhost:5432/ecopart_demo" \
    ecopart-backend

# init base
$ docker exec -ti ecopart-backend alembic upgrade head

# populate base
$ docker exec -ti ecopart-backend python initial_data.py -d /data/samples-data.json
```
