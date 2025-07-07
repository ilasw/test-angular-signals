FROM node:21.7.3

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build --configuration=production

FROM nginx:latest

COPY --from=build app/dist/aftas-angular /usr/share/nginx/html

EXPOSE 80
