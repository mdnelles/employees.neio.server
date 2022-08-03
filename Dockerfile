# syntax=docker/dockerfile:1
# recommend using docker/dockerfile:1, which always points to the latest release of the version 1 syntax

FROM node:18

# environment variable => production  improve performance
ENV NODE_ENV=production

WORKDIR /app

# COPY ["<src>", "<dest>"]
COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

EXPOSE 5010

EXPOSE 3306

COPY . .

CMD ["npm", "run", "start"]
