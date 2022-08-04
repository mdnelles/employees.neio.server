# NodeJS Employees Back End

This is a back end application that comminicates directly with the database for authentication and data retrieval.

## Features

-  NodeJS
-  Typescript
-  Express web server
-  Tokenized session with JWT
-  MySql DataBase

## Notes:

`docker-compose --file mysql/docker-compose.yml up -d`
The `up` flag stands for Create and starts containers and `-d` is the detached mode which lets you run docker ps to check the status of the container:

## Types

In order to swap `import` instead of `require` types folder had to be created.

Was `const express = require("express");` is
`import express from "express";`

>

    types
        |_express
            |_ index.d.ts
                declare module "express";

## Docker

restart: `killall Docker && open /Applications/Docker.app`

https://hub.docker.com/ > search `mysql` find the command as below:

`docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag`

(remove tag add port numbers)

`docker run -d -p 3306:3306 --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret`

## The web service

The first directive in the web service is to build the image based on our Dockerfile. This will recreate the image we used before, but it will now be named according to the project we are in, nodejsexpresstodoapp. After that, we are giving the service some specific instructions on how it should operate:

-  command: `npm run dev` - Once the image is built, and the container is running, the npm run dev command will start the application.

-  volumes: - This section will mount paths between the host and the container.

-  .:/app/ - This will mount the root directory to our working directory in the container.

-  /app/node_modules - This will mount the node_modules directory to the host machine using the buildtime directory.

-  environment: - The application itself expects the environment variable `DATABASE_URL` to run. This is set in db.js.

-  ports: - This will publish the container's port, in this case 5010, to the host as port 5010.

## testing

Example: To test if mysql is running in the container after it is spun up:
`mysql -u USERNAME -p --host=127.0.0.1 --port=3306` or `mysql -u USERNAME -p --host=localhost --port=3306`

To cause the port number to be used, force a TCP/IP connection. For example, invoke the program in either of these ways:

````mysql --port=13306 --host=127.0.0.1
mysql --port=13306 --protocol=TCP```

## Authors

-  [@mdnelles](https://www.github.com/mdnelles)
````
