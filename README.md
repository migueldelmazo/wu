# Wu framework: v2

![Wu](./resources/wu-logotype-03.png)

## Setup and start app

```sh
$ npm install
$ npm start
```

## Documentation

## Conventional function flow VS Wu data flow

Wu is a framework that attempts **to remove function flows** from an application and **turn them into reactions in the data model**.

That is, we don't want to think about the flow of the application, but rather about the consistency of the data.

**Every small data change is saved in the data model and it triggers reactions for other pieces of code** to paint data in the view, call an endpoint, or **change other data in the model causing another chain reaction**.

The following drawing compares the conventional function flow that is always used with Wu's data flow proposal.

[![](./coventional-vs-data-flow.svg)Example of a login flow](https://raw.githubusercontent.com/migueldelmazo/wu/v2/coventional-vs-data-flow.svg)

The main idea is to **work with a main data model and a set of small functions** that modify and react to changes in the data model.

Wu is a reactive framework that works with pure functions.

### DevTools

Wu displays all data model state changes in the console. **Open DevTools > Console to understand how Wu works.**

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
- React components:
  - `WuLink`: paint a link or button to navigate using Wu.
  - `WuBakcLink`: paint a link or button to navigate back using Wu.