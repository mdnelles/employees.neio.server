
FROM node:18

# environment variable => production  improve performance
ENV NODE_ENV=production

WORKDIR /app

# ["<src>", "<dest>"]
COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

EXPOSE 5010 3306 3307

COPY . .

CMD ["npm", "run", "start"]
