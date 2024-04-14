# Backend Architecture

## Structure

```
backend
|-- .env
|-- package.json
|-- src/
    |-- config/
    |-- controllers/
    |-- middlewares/
    |-- models/
    |-- routes/
    |-- services/
    |-- app.ts
    `-- swagger.json
```

## Description

`.env`: file used to store environment variables

`package.json`: information about the node application, modules and packages

`src`: contains the source files

`config`: contains the configurations needed for the application

`controllers`: contains the controllers of the application. Controllers manage or direct the flow of data between two entities

`middlewares`: services connecting websites to the backend database

`models`: structure of the sql tables

`routes`: contains all the sub-folders that contain the routes needed for the project

`services`: contains all the functions corresponding with the third-party services

`app.js`: entry point

