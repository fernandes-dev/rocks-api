# Welcome to rocks-api 👋
![Version](https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000)
[![License: UNLICENSED](https://img.shields.io/badge/License-UNLICENSED-yellow.svg)](#)
[![Twitter: fernandesdotts](https://img.shields.io/twitter/follow/fernandesdotts.svg?style=social)](https://twitter.com/fernandesdotts)

> api with nestjs and graphql

## Install

```sh
yarn
```

## To execute tests and application

1. Execute docker database

```sh
docker-compose up -d
```

2. Migrate database

```sh
npx prisma migrate dev --name crate_database
```

3. Execute seeds

```
npx prisma db seed
```

## Usage

```sh
yarn start:dev
```

## To access api, get user token in:
### `src/database/seeds/seed-users.ts`

## Run tests

```sh
yarn test
```

![Tests](./test/rocks-api-tests.png)

## Author

👤 **Eduardo Fernandes**

* Twitter: [@fernandesdotts](https://twitter.com/fernandesdotts)
* Github: [@fernandes-dev](https://github.com/fernandes-dev)
* LinkedIn: [@fernandes-dev](https://linkedin.com/in/fernandes-dev)

## Show your support

Give a ⭐️ if this project helped you!


***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_