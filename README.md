# Mock Premier League system



A mock football league system, an application where users can login and create view teams and fixtures created by an admin. 


  - Hosted on heroku - https://mock-footy-league.herokuapp.com/
  - Postman Collection can be found here https://documenter.getpostman.com/view/3344471/TVKEXGwU


# Tools

  - Node.js/TypeScript     
  - Express
  - MongoDB
  - Redis
  - Jest
  - heroku

### Installation

Mock Premier League requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies, rename the .env-example file to .env file in the root directory and fill in appropriate environment variables and start the server.


For local environments(dev mode)...

```sh
$ npm install
$ npm run dev
```

With docker

```sh
$ docker build -t <image name> .
```

```sh
$ docker-compose up
```


### Test
CAVEAT: All test files is encouraged to be run individually
(Recommended) 
```sh
$ npm test utils.test.ts
```
or
```sh
$ npm test
```

License
----

MIT
