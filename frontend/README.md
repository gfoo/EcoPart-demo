## Local dev

Create a `.env.development.local` file contaning dev configurations (required backend [here](../backend/)) :

```
REACT_APP_API_URL="http://localhost:8000"
```

Install dependencies and launch:

```shell
$ npm install
$ npm start
```

-> http://localhost:3000

## Build and run docker image

```shell
# build
$ docker build \
     --build-arg REACT_APP_BACKEND_API_URL="http://localhost:8000" \
     -t ecopart-frontend .

# launch
$ docker run --rm \
    -e REACT_APP_BACKEND_API_URL="http://localhost:8000" \
    -d --name ecopart-frontend \
    -p 3000:80 \
    ecopart-frontend
```

-> http://localhost:3000/
