# Wu framework: v2

![Wu](./resources/wu-logotype-03.png)

## Setup and start app

```sh
$ npm install
$ npm start
```

## Documentation

Wu is a framework that attempts **to remove function flows** from an application and **turn them into reactions in the data model**.

That is, we don't want to think about the flow of the application, but rather about the consistency of the data.

The main idea is to **work with a main data model and a set of small functions** that modify and react to changes in the data model.

Wu is a reactive framework that works with pure functions.

### Main methods:

- User actions:
  - `wuSet`: User action > Update model.
  - `wuFetch`: User action > Fetch API > Update model.
- Reactive methods:
  - `wuReact`: Model change > Update model.
  - `wuReactiveFetch`: Model change > Fetch API > Update model.
  - `wuRouter`: Route change > Update model.
- Getter methods:
  - `wuGet`: get model data
  - `useWuGet`: React hook to get model data.

### Other info:

- Data synchronization:
  - Wu keeps the browser's storage (`localStorage` and `sessionStorage`) synchronized with the Wu data model.
  - Wu keeps the browser's online status (`navigator.onLine`) synchronized with the Wu data model.
- Components:
  - `WuLink`: paint a link or button to navigate using Wu.
  - `WuBakcLink`: paint a link or button to navigate back using Wu.