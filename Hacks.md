# Hacks

Following hacks applied over the default sapper rollup template

- Replace polka with express
- Add tailwind config
- Add postcss config
- Add eslint config
- Add sample .env
- Update rollup to inject extra env vars
- Put .env file in .gitignore

## Getting started

## Pre-requisite

- node 10+
- redis (installed locally available at default port)
- Drupal JSON-API endpoint configured with OAuth

## Configuration

Create a `.env` file in project root. You may copy `.env.sample` and edit relevant values.

## Running the project

However you get the code, you can install dependencies and run the project in development mode with:

```bash
cd my-app
yarn # or npm install
yarn run dev # or npm run dev
```

For pretty debug messages while developing,

```bash
env LOG_LEVEL=debug yarn run dev | ./node_modules/.bin/pino-pretty -i hostname,pid -t "yyyy-mm-dd HH:MM:ss.l"
```

Open up [localhost:3000](http://localhost:3000) and start clicking around.


## Production mode and deployment

@TODO
