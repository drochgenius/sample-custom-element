# Example custom element bundled with webpack

Example web component development environment using:

- `@hmh-cam/component-base` library
- [TypeScript](https://www.typescriptlang.org/)
- [Wepbpack 4](https://webpack.js.org/)
- [Browsersync](https://www.browsersync.io/) as the development server
- `@hmh-cam/component-tester` as the component unit test framework.

## Getting Started

```bash
# install dependencies
npm install
# build and watch for code changes
npm run watch
# in another terminal, launch the browser
npm start
```

## Component Unit Tests

```bash
# build and watch in test mode
npm run watch-test
# run unit tests with coverage
npm test
# develop unit tests in the browser
npm run test-dev
```

When running the `test-dev` script, open your browser at http://localhost:3001.

## Other useful commands

```bash
# lint and format the code base
npm run lint
# prepare a clean install
npm run clean
```
