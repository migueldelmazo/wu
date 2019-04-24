# Wu framework
Wu is a framework for building web applications:
* **Reactive data model:** the reactive data model is the core of Wu. **You can observe any path of the data model** and when someone changes the value of your path **you will be warned to react** as you want. No element of Wu is related to each other. **All elements are related through the reactive data model.**
* **Declarative:** each of the 6 items ([API](#api), [ensurer](#ensurer), [watcher](#watcher), [router](#router), [getter](#getter) and [setter](#setter)) are defined with a simple declarative interface.
* **Functional programming:** all items (except [watcher](#watcher)) use functional programming. From Wu we recommend that all functions that you write be pure.
* **Model-oriented:** your responsibility as a developer is to ensure that **the data model is consistent**. If you meet this condition the development with Wu is easy and fast.
* **No flows, no past, no future:** with Wu you only have to worry about the data model being coherent. It does not matter in what order things happen, no matter what happened in the past, no matter what will happen in the future, **you should only worry that the current data model is consistent.**
* Wu guarantees that **all the actions that have to happen, will happen**.

![Pattern](./docs/wu-framework.svg)

## Wu concepts

### [Ensurer:](./docs/documentation-ensurer.md)
**Ensurer** allows you to execute a function and save its result in the data model every time other data change. The goal is to always keep the data model consistent.

```javascript
wu.create('ensurer', 'userIsLogged', { // name of the ensurer item
  // path of the data model that we are watching
  onChange: 'user.id',
  // arguments that will receive the function 'run'
  args: 'user.id',
  // pure function that runs when 'onChange' has changed
  run: (userId) => {
    return !!userId
  },
  // path of the data model where to save the result of 'run'
  update: 'user.isLogged'
})
```

### [Watcher:](./docs/documentation-watcher.md)
**Watcher** works exactly like [ensurer](#ensurer) but does not save the result of the function in the data model. The goal is to use it to call third-party libraries such as React JS, LocalStorage, Stripe...

```javascript
wu.create('watcher', 'setUserIdInLocalStorage', { // name of the watcher item
  // path of the data model that we are watching
  onChange: 'user.id',
  // arguments that will receive the function 'run'
  args: 'user.id',
  // impure function that runs when 'onChange' has changed
  run: (userId) => {
    window.localStorage.setItem('userId', userId)
  }
})
```

### [Router:](./docs/documentation-router.md)
**Router** allows you to watch changes in the browser URL and save the normalized route in the data model.
The data stored in the model are the URL params and if the route is active.

```javascript
wu.create('router', 'userLoginRoute', { // name of the router item
  urlPattern: '/user/:userId/detail',
  update: 'user.detail.route'
})

// when browser URL is '/user/asdf1234/detail' 'user.detail.route' is { isActive: true, params: { userId: 'asdf1234' } }
// when browser URL is not '/user/asdf1234/detail' 'user.detail.route' is { isActive: false, params: {} }
```

Also, in order for you to be able to get the URL data and watch the changes, when the browser URL changes,
the path of the data model **'app.route'** is updated. More info in [router documentation](./docs/documentation-router.md).

### [Getter:](./docs/documentation-getter.md)
**Getter** allows you to define an interface to get data from the data model outside of Wu.

```javascript
// file user.js
wu.create('getter', 'userGreeting', { // name of the getter item
  // arguments that will receive the function 'run'
  args: ['user.name', 'user.lang'],
  // pure function
  run: (name, lang) => {
    if (lang === 'en') return 'Hello ' + name
    else if (lang === 'it') return 'Ciao ' + name
    else return 'Hola ' + name
  }
})
// file userGreeting.template.js
render () {
  return (
    <h1>{wu.getter('userGreeting')}</h1>
  )
}

// when 'user.name' is 'Anna' and 'user.lang' is 'en' the result of render is '<h1>Hello Anna</h1>'
```

### [Setter:](./docs/documentation-setter.md)
**Setter** allows you to define an interface to save data from outside to the Wu data model.

```javascript
// file user.js
wu.create('setter', 'userSendLoginData', { // name of the setter item
  // pure function
  run: (email, password) => {
    return {
      email,
      password
    }
  },
  // path of the data model where to save the result of 'run'
  update: 'user.login.data'
})
// file userLogin.template.js
sendLoginData () {
  wu.setter('userSendLoginData', 'email@email.com', '12345678')
}

// when 'sendLoginData' is executed 'user.login.data' will have { email: 'email@email.com', password: '12345678' }
```

### [API:](./docs/documentation-api.md)
**API** allows you to watch changes in the data model and send Ajax requests to your server. When the server responses, **API** helps you manage it and save it in the data model.

```javascript
wu.create('api', 'userProfile', { // name of the api item
  // path of the data model that we are watching
  onChange: 'user.id',
  request: {
    // request method
    method: 'get',
    // request URL or path
    path: 'https://server.com/api/user/profile',
  },
  handlers: {
    // if response http code is 200
    onCode200: [
      {
        // save 'response.body' in 'user.profile' data model path
        run: (response) => {
          return response.body
        },
        update: 'user.profile'
      }
    ]
  }
})
```

## Setup and start

```
npm install
npm start
```

## Documentation

You can find Wu documentation in following pages:
* Wu items:
  * [API](./docs/documentation-api.md)
  * [ensurer](./docs/documentation-ensurer.md)
  * [watcher](./docs/documentation-watcher.md)
  * [router](./docs/documentation-router.md)
  * [getter](./docs/documentation-getter.md)
  * [setter](./docs/documentation-setter.md)
* Public methods:
  * [`wu.create()`](./docs/documentation-public-methods.md#wucreate)
  * [`wu.start()`](./docs/documentation-public-methods.md#wustart)
  * [`wu.getter()`](./docs/documentation-public-methods.md#wugetter)
  * [`wu.setter()`](./docs/documentation-public-methods.md#wusetter)
* Public model methods:
  * [`wu.model.set()`](./docs/documentation-public-model-methods.md#wumodelset)
  * [`wu.model.get()`](./docs/documentation-public-model-methods.md#wumodelget)
  * [`wu.model.populate()`](./docs/documentation-public-model-methods.md#wumodelpopulate)
  * [`wu.model.watch()`](./docs/documentation-public-model-methods.md#wumodelwatch)
  * [`wu.model.stopWatching()`](./docs/documentation-public-model-methods.md#wumodelstopwatching)
* Wu items properties:
  * [`onChange`](./docs/documentation-properties.md#onchange)
  * [`when`](./docs/documentation-properties.md#when)
  * [`args`](./docs/documentation-properties.md#args)
  * [`run`](./docs/documentation-properties.md#run)
  * [`update`](./docs/documentation-properties.md#update)
  * [`urlPattern`](./docs/documentation-properties.md#urlpattern)
* [Wu console functionality](./docs/documentation-console.md)

## Third-party libraries

It is very easy to work with third-party libraries using [getters](./docs/documentation-getter.md), [setters](./docs/documentation-setter.md) and [watchers](./docs/documentation-watcher.md).

### ReactJS

Wu allows you to use [React JS classes](https://reactjs.org) that are already integrated with the functionality of Wu.

```javascript
import React from 'react'
import WuComponent from 'wu/react-component'

export default class MyView extends WuComponent {
  onChange () {
    // path of the data model that we are watching
    // when 'user.name' or 'user.lang' change in the data model this view will be rendered automatically
    return ['user.name', 'user.lang']
  }
  render () {
    return (
      <div>
        { this.get('getGreeting') }
      </div>
    )
  }
}
```

## Dependencies

Wu only has one dependency: [Lodash](https://lodash.com)

## Current state of Wu

Wu is an experimental framework that is still in **beta**. The main purpose of Wu is to perform a proof of concept to compare this programming pattern with other patterns.

## Contributions

If you are interested in participating in the improvement or development of Wu please contact me: [migueldelmazo](//migueldelmazo.com). I would love for you to help me develop Wu.

I would especially like to receive suggestions about the names of the methods, so that they are more readable and easier to use.

## License

Wu is [MIT licensed](./docs/LICENSE.txt).
