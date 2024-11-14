# PITO PLATFORM

## Description

This is the **PITO Platform** project, built using the **NestJS** framework with microservices architecture, integrating **gRPC**, **RabbitMQ**, and **Redis**.

## Project setup

To install the necessary dependencies, run:

```bash
$ yarn install
```

## Compile and run the project

To start the API Gateway (default service), run:

```bash
# development
$ yarn run start api-gateway

# watch mode
$ yarn run start:dev api-gateway

# production mode
$ yarn run start:prod api-gateway
```

## Starting Other Services

```bash
# order service
$ yarn run start:dev order-service

# user service
$ yarn run start:dev user-service

# billing service
$ yarn run start:dev billing-service

# notification service
$ yarn run start:dev notification-service
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Code Quality Check

After writing code, ensure to run the following commands to maintain code quality:

```bash
$ yarn lint
$ yarn format
```

## Helpful CLIs

```bash
# If you make changes to the .proto files, use the following command to regenerate the protobuf
$ yarn generate:protobuf

# Generate new application
nest g app review-service

# Generate new resource
nest g resource users
```

## Additional Links

- [Platform Architecture](https://www.figma.com/board/xmNNXsty97RpDAbbNsinWq/PITO-Architecture)
- [Data Modeling](https://www.figma.com/board/qIWCqQHI95vG4xrcOMunKQ/Data-Modeling)

## Reference Documentation

Check out a few resources that may come in handy when working with project:

- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [gRPC](https://grpc.io/docs/)
- [RabbitMQ](https://www.rabbitmq.com/docs)
- [Redis](https://redis.io/docs/latest/)
- [Commit Message Conventions](https://pitovn.atlassian.net/wiki/spaces/EW/pages/109740033/Commit+rules)
- [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
