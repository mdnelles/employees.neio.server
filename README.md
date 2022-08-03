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
was `const express = require("express");` is
`import express from "express";`

>

    types
        |_express
            |_ index.d.ts
                declare module "express";

