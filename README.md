
## Description

Develop a RESTful API for a simple task management system with the following features
- User Authentication: Implement authentication using JWT tokens.
- CRUD Operations: Implement endpoints for creating, reading, updating, and deleting tasks.
- Data Persistence: Use a database of your choice to store task data.
- Input Validation: Validate input data to ensure data integrity and security.


## Installation

```bash
$ npm install
```

## Running the app

```bash
# Set up the database with the docker compose file
# Ensure Docker is installed in the local machine
$ docker compose up postgres

# development

$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running the Docker Image
There is also a docker file 

```bash
docker build -t task-mgt-app .
docker run --rm -p 5000:5000 task-mgt-app

```


## Documentation

When the app is up and running
The swagger documentation is available on http://localhost:5000/docs
If you prefer the postman version, visit http://localhost:5000/docs-api and import the json file into your postman