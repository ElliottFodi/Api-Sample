// assumptions: 
// this service is behind a WAF and a proxy that handles authentication and rate limiting 

// TODO:
// add jest unit tests 
// add read me 
// push to git

// relative paths
// close db connection
// clean up swagger annotations
// handeling DB credentials 
// linter

// http://localhost:8080/api-docs/#/


// a note about the db url when running in docker compose 
// const url = 'mongodb://localhost:27017';
// const url = 'mongodb://mongoDB:27017';

// docker commands
// docker compose build
// NODE_ENV=wip docker-compose up

// running locally with out docker
// node src/Routes/routes.mjs
// db name: efuseMongo