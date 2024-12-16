# btms-frontend

[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_btms-frontend&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=DEFRA_btms-frontend)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_btms-frontend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=DEFRA_btms-frontend)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_btms-frontend&metric=coverage)](https://sonarcloud.io/summary/new_code?id=DEFRA_btms-frontend)

The frontend service for the BTMS solution, including user journeys, dashboards & admin functions.

This project includes a number of solution level resources, including a docker compose stack.

## Docker compose

The docker compose stack assumes other BTMS service repos are present as siblings of this one,
currently btms-backend & btms-telemetry-extension, but will also include btms-gateway & btms-gateway-stub.

The compose config relies on a number of 'secrets' config files being present in the compose folder - these can be obtained from existing
team members:

- btms-frontend/compose/backend-secrets.env
- btms-frontend/compose/backend-local.env
- btms-frontend/compose/frontend-local.env

The intention is that the compose setup works as much as possible 'out of the box' and provides a default starting
point, but then once the services are up & working, a user can reconfigure them using the
.local config files, to enable different scenarios they may want to test. Different data sets for example.

`docker compose up`

Can then be used to bring up the solution. The services will then be available:

- [btms-frontend](http://btms-frontend.localtest.me:9081/)
- [btms-backend](http://btms-backend.localtest.me:9080/)
- [grafana](http://grafana.localtest.me:9000/)

Running the initialise method will load an initial dataset in from DMP:

`http://btms-backend.localtest.me:9080/mgmt/initialise?syncPeriod=All`

The state of the work can be seen here:

`http://btms-backend.localtest.me:9080/sync/jobs`

`http://btms-backend.localtest.me:9080/mgmt/collections`

With logs & metrics:

`http://grafana.localtest.me:9000/a/grafana-lokiexplore-app`

`http://grafana.localtest.me:9000/d/ce451ma3l1nuoc/btms-backend`

And the analytics dashboard here:

`http://localhost:9081/analytics`

The service is based on the CDP Node.js Frontend Template. Further background on that is provided here:

- [Requirements](#requirements)
  - [Node.js](#nodejs)
- [Server-side Caching](#server-side-caching)
- [Redis](#redis)
- [Local Development](#local-development)
  - [Setup](#setup)
  - [Development](#development)
  - [Production](#production)
  - [Npm scripts](#npm-scripts)
  - [Update dependencies](#update-dependencies)
  - [Formatting](#formatting)
    - [Windows prettier issue](#windows-prettier-issue)
- [Docker](#docker)
  - [Development image](#development-image)
  - [Production image](#production-image)
  - [Docker Compose](#docker-compose)
  - [Dependabot](#dependabot)
  - [SonarCloud](#sonarcloud)
- [Licence](#licence)
  - [About the licence](#about-the-licence)

## Requirements

### Node.js

Please install [Node.js](http://nodejs.org/) `>= v18` and [npm](https://nodejs.org/) `>= v9`. You will find it
easier to use the Node Version Manager [nvm](https://github.com/creationix/nvm)

To use the correct version of Node.js for this application, via nvm:

```bash
cd btms-frontend
nvm use
```

## Server-side Caching

We use Catbox for server-side caching. By default the service will use CatboxRedis when deployed and CatboxMemory for
local development.
You can override the default behaviour by setting the `SESSION_CACHE_ENGINE` environment variable to either `redis` or
`memory`.

Please note: CatboxMemory (`memory`) is _not_ suitable for production use! The cache will not be shared between each
instance of the service and it will not persist between restarts.

## Redis

Redis is an in-memory key-value store. Every instance of a service has access to the same Redis key-value store similar
to how services might have a database (or MongoDB). All frontend services are given access to a namespaced prefixed that
matches the service name. e.g. `my-service` will have access to everything in Redis that is prefixed with `my-service`.

If your service does not require a session cache to be shared between instances or if you don't require Redis, you can
disable setting `SESSION_CACHE_ENGINE=false` or changing the default value in `~/src/config/index.js`.

## Local Development

### Setup

Install application dependencies:

```bash
npm install
```

### Development

To run the application in `development` mode run:

```bash
npm run dev
```

### Production

To mimic the application running in `production` mode locally run:

```bash
npm start
```

### Npm scripts

All available Npm scripts can be seen in [package.json](./package.json)
To view them in your command line run:

```bash
npm run
```

### Update dependencies

To update dependencies use [npm-check-updates](https://github.com/raineorshine/npm-check-updates):

> The following script is a good start. Check out all the options on
> the [npm-check-updates](https://github.com/raineorshine/npm-check-updates)

```bash
ncu --interactive --format group
```

### Formatting

#### Windows prettier issue

If you are having issues with formatting of line breaks on Windows update your global git config by running:

```bash
git config --global core.autocrlf false
```

## Docker

### Development image

Build:

```bash
docker build --target development --no-cache --tag btms-frontend:development .
```

Run:

```bash
docker run -p 3000:3000 btms-frontend:development
```

### Production image

Build:

```bash
docker build --no-cache --tag btms-frontend .
```

Run:

```bash
docker run -p 3000:3000 btms-frontend
```

### Docker Compose

A local environment with:

- Localstack for AWS services (S3, SQS)
- Redis
- MongoDB
- This service.
- A commented out backend example.

```bash
docker compose up --build -d
```

### Dependabot

We have added an example dependabot configuration file to the repository. You can enable it by renaming
the [.github/example.dependabot.yml](.github/example.dependabot.yml) to `.github/dependabot.yml`

### SonarCloud

Instructions for setting up SonarCloud can be found in [sonar-project.properties](./sonar-project.properties)

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable
information providers in the public sector to license the use and re-use of their information under a common open
licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
