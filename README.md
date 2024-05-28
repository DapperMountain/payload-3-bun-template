# Overview

This is an opinionated setup of Payload 3, incorporating Database seed scripts, abstracted access control and hooks, using [Bun](https://bun.sh/).

## Development

To spin up the project locally, follow these steps:

1. First clone the repo
1. Then `cd YOUR_PROJECT_REPO && cp .env.example .env`
1. Next `bun install && bun dev` (or `docker-compose up -d`, see [Docker](#docker))
1. Run `bun run db:seed` to seed the database. see [src/database/seed](src/database/seed)
1. Now `open http://localhost:3001/admin` to access the admin panel
1. Log in using one of the users defined during the database seed process

That's it! Changes made in `./src` will be reflected in your app.

### Docker

Alternatively, you can use [Docker](https://www.docker.com) to spin up this project locally. To do so, follow these steps:

1. Follow [steps 1 and 2 from above](#development), the docker-compose file will automatically use the `.env` file in your project root
1. Next run `docker-compose up -d`
1. Shell into the container and run [step 4 from above](#development) to seed the database
1. Follow [steps 5 and 6 from above](#development) to login and create your first admin user

That's it! The Docker instance will help you get up and running quickly while also standardizing the development environment across your teams.

## Production

To run Payload in production, you need to build and serve the Admin panel. To do so, follow these steps:

1. First invoke the `payload build` script by running `bun run build` in your project root. This creates a `./build` directory with a production-ready admin bundle.
1. Then run `bun start` to run Node in production and serve Payload from the `./build` directory.

### Deployment

The easiest way to deploy your project is to use [Payload Cloud](https://payloadcms.com/new/import), a one-click hosting solution to deploy production-ready instances of your Payload apps directly from your GitHub repo. You can also deploy your app manually, check out the [deployment documentation](https://payloadcms.com/docs/production/deployment) for full details.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
