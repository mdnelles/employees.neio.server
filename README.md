# NodeJS Employees Back End

This is a back end application that comminicates directly with the database for authentication and data retrieval.

## Features

-  NodeJS
-  Typescript
-  Express web server
-  Tokenized session with JWT
-  MySql DataBase

## Dockerize

`docker compose -f docker-combined.yml up -d`
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

## Docker Additional Notes

restart: `killall Docker && open /Applications/Docker.app`

https://hub.docker.com/ > search `mysql` find the command as below:

`docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag`

(remove tag add port numbers)

`docker run -d -p 3306:3306 --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret`
&
`docker run -t -i -e NODE_DB_HOST='host.docker.internal' -p 5010:5010 server_node-server`
Make sure your mysql server can allow connections from different hosts
In `my.cnf` if you use bind-address = 0.0.0.0 your MySQL server will listen for connections on all network interfaces. That means your MySQL server could be reached from the Internet ; make sure to setup firewall rules accordingly.

## The web service

The first directive in the web service is to build the image based on our Dockerfile. This will recreate the image we used before, but it will now be named according to the project we are in, nodejsexpresstodoapp. After that, we are giving the service some specific instructions on how it should operate:

-  command: `npm run dev` - Once the image is built, and the container is running, the npm run dev command will start the application.

-  volumes: - This section will mount paths between the host and the container.

-  .:/app/ - This will mount the root directory to our working directory in the container.

-  /app/node_modules - This will mount the node_modules directory to the host machine using the buildtime directory.

-  environment: - The application itself expects the environment variable `DATABASE_URL` to run. This is set in db.js.

-  ports: - This will publish the container's port, in this case 5010, to the host as port 5010.

## Note about MySQL

In order for MySQL to be reachable by NodeJS app the host must be different from the test environment. `host.docker.internal` so the following was put in to the db.ts file.

> `const host = !!isDocker() ? "host.docker.internal" : env.NODE_DB_HOST;`

## Manage multi-container setups with Docker Compose

Compose is a tool for defining and running multi-container Docker applications. With Compose, you define the services that need to run in a YAML file. Then bring up the services by using the docker-compose command.

Advantages

-  You describe the multi-container setup in a clear manifest and bring up the containers in a single command.
-  You can define the priority and dependency of the container to other containers.
-  It is excellent for starting development and testing environments.
-  You can ramp up legacy environments without polluting your host or client system.

To spin up mysql container `docker compose -f mysql.yml up`.
