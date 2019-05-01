# Northcoders News API

Northcoder News is a Reddit-style social news, content rating and discussion website written in React, completed as part of the intensive full time Developer Pathway course at Northcoders in Manchester between February 2019 - May 2019.

The backend consists of a RESTful API which allows access to a PSQL database.

The deployed API for the backend can be found here: https://nc-news-server-2019.herokuapp.com/api

The deployed version of the site can be found here: https://nc-news-cb.netlify.com/
The github repo for the frontend can be found here: https://github.com/CBennett15/NC_News_FE

## Getting Started

### Prerequisites

```
Node.js
PostgreSQL
```

### Installing

1. Fork and clone down this .git repository

```
git clone https://github.com/CBennett15/NC_News_BE.git
```

2. Navigate inside the folder and install all dependencies:

```
npm install
```

3. For testing an developement you will need to create a knexfile.js. Make sure this is added to .gitignore

```
const ENV = process.env.NODE_ENV || 'development';
const { DB_URL } = process.env;

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
};

const customConfigs = {
  development: {
    connection: {
      database: 'nc_news',
      // username: "" << linux requires this
      // password: "" << linux requires this
    },
  },
  test: {
    connection: {
      database: 'nc_news_test',
      // username: "", << linux requires this
      // password: "", << linux requires this
    },
  },
  production: {
    connection: `${DB_URL}?ssl=true`,
  },
};

module.exports = { ...baseConfig, ...customConfigs[ENV] };
```

4. Ensure you have PostgreSQL running.
5. Seed your database:

```
npm run seed
```

6. You can then run the application by typing `npm run dev` into your terminal which will start up a local server on Port 9090
7. Open a browser of your choice and navigate to localhost:9090/api. This will give you a list of possible API endpoints, all of which you can navigate to.

## Testing

All tests are run using mocha, chai and supertest. The tests check all API endpoints and automatically reseed the test database before each test is run. All tests can be run using:

```
npm test
```

## Built With

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

## Authors

[Cheryl Bennett](https://github.com/CBennett15)

## Acknowledgements

Everyone at Northcoders for their outstanding curriculum and support.
