# Docker compose stack deploy

Prepare `.env` file:

```
PROJECT_NAME="ecopart_api_demo"
SQLALCHEMY_DATABASE_URI="postgresql://postgres:postgres@db:5432/postgres"

BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:8001"]

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_SERVER=db
POSTGRES_PORT=5432
POSTGRES_DB=postgres

```

Launch stack:

```shell
# build and launch stack
$ docker-compose up --build -d

# init database
# pg data storage will be in postgres_data/ folder (remove it to re-init process)
$ docker-compose exec backend alembic upgrade head

# populate database
# (unzip samples-data.json.zip if not yet done)
$ docker-compose exec backend python initial_data.py -d /data/samples-data.json
```

-> backend http://localhost:8000/docs
-> frontend http://localhost:8001
