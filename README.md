# Overview

This is an opinionated setup of Payload 3, with the following features:

- Uses [Bun](https://bun.sh/)
- Centralized [Zod](https://zod.dev/) config
- Abstracted Role-based access controls
- Multi-tenant support
- Database seed scripts
- Unit test examples

## Development

### Docker

Alternatively, you can use [Docker](https://www.docker.com) to spin up this project locally. To do so, follow these steps:

1. First clone the repo
1. Then `cd YOUR_PROJECT_REPO && cp .env.example .env`
1. Next run `docker compose up -d`
1. Shell into the container
1. Run `bun db:seed:run` to seed the database. see [src/database/seed](src/database/seed)
1. Now `open http://localhost:3001/admin` to access the admin panel
1. Log in using one of the users defined during the database seed process

That's it! The Docker instance will help you get up and running quickly while also standardizing the development environment across your teams.

### Local

1. First clone the repo
1. Then `cd YOUR_PROJECT_REPO && cp .env.example .env`
1. Next `bun install && bun dev`
1. Run `bun db:seed:run` to seed the database. see [src/database/seed](src/database/seed)
1. Now `open http://localhost:3001/admin` to access the admin panel
1. Log in using one of the users defined during the database seed process

That's it! Changes made in `./src` will be reflected in your app.

## Production

To run Payload in production, you need to build and serve the Admin panel. To do so, follow these steps:

1. First invoke the `payload build` script by running `bun build` in your project root. This creates a `./build` directory with a production-ready admin bundle.
1. Then run `bun start` to run Node in production and serve Payload from the `./build` directory.

### Deployment

The easiest way to deploy your project is to use [Payload Cloud](https://payloadcms.com/new/import), a one-click hosting solution to deploy production-ready instances of your Payload apps directly from your GitHub repo. You can also deploy your app manually, check out the [deployment documentation](https://payloadcms.com/docs/beta/production/deployment) for full details.

## Acknowledgments

**[payload-tools](https://github.com/teunmooij/payload-tools)**: Portions of the access logic were adapted from the [payload-rbac](https://github.com/teunmooij/payload-tools/tree/main/packages/rbac) package within that repository.
