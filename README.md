# Mern Starter Project

This should provide you with a working app with auth and theming all set up.

You will want to do a search for `mern-starter` in the project and replace all occurrences with the appropriate values.

I do not guarantee that this will work without issues though, so make sure to do thorough testing of your own before relying on the auth.

If you do find a problem, please submit an issue.

## Setup for Development

### Ensure that you have npm and node installed

If you are not sure if you do, type `node -v`
and `npm -v`, and it will either say `command not found`
or tell you a version number.

If any of the above are not installed, using homebrew,
type `brew install node`.

Installing node will also install npm

### Clone the repository onto your computer

Clone the repository

```bash
git clone <repo url>
cd mern-starter
```

### Install dependencies

To install all dependencies, run:

```bash
npm install:all
```

### Add config/secrets.js

```js
// config/secrets.js
module.exports = {
  mongoURI: 'mongodb+srv://mern-starter:<password>@cluster0.ebdpy.mongodb.net/<dbname>?retryWrites=true&w=majority',
  jwtKey: '<secure key>',
};
```

You can also start a local mongo database and use that key instead.
See [installing mongodb](https://docs.mongodb.com/manual/installation/).

### Start development server

To start the development server, run:

```bash
npm run start:dev
```

Instead of adding a secrets.js file you can export the
mongo uri as an environment variable:

```bash
export MONGO_URI=<mongodb uri> yarn start:dev
```
