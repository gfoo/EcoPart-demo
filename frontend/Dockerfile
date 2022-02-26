# build environment
FROM node:16.4-alpine as build

ARG REACT_APP_BACKEND_API_URL
ENV REACT_APP_BACKEND_API_URL=$REACT_APP_BACKEND_API_URL

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
