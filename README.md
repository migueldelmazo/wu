![Pattern](./docs/wu-framework.png)

# Wu framework

Wu is a framework for building web applications:

* **Reactive data model:** the reactive data model is the heart of Wu. **You can observe any path of the data model** and when someone changes the value of your path **you will be warned to react** as you want. No element of Wu is related to each other. **All elements are related through the reactive data model.**
* **Declarative:** each of the 6 items ([API](#api), [ensurer](#ensurer), [watcher](#watcher), [router](#router), [getter](#getter) and [setter](#setter)) are defined with a simple declarative interface.
* **Functional programming:** all items (except [watcher](#watcher)) use functional programming. From Wu we recommend that all functions that you write be pure.
* **Model-oriented:** your responsibility as a developer is to ensure that **the data model is consistent**. If you meet this condition the development with Wu is easy and fast.
* **No flows, no past, no future:** with Wu you only have to worry about the data model being coherent. It does not matter in what order things happen, no matter what happened in the past, no matter what will happen in the future, **you should only worry that the current data model is consistent.**

## Wu concepts

### ensurer:
**ensurer** allows you to execute a function and save its result in the data model every time other data change. The goal is to always keep the data model consistent.
(Allows the use of functional programming).

```javascript
wu.create('ensurer', 'userIsLogged', { // name of the ensurer item
  onChange: {
    // path of the data model that we are watching
    paths: 'user.id',
    // 'fn' function will only be executed when the value of 'user.id' is a non-empty string
    check: {
      'user.id': [_.negate(_.isEmpty), _.isString]
    }
  },
  // arguments that will receive the function 'fn'
  from: 'user.id',
  // pure function that runs when 'onChange.paths' has changed
  fn: (userId) => {
    return !!userId
  },
  // path of the data model where to save the result of 'fn'
  to: 'user.isLogged'
})
```

### watcher:
**watcher** works exactly like [ensurer](#ensurer) but does not save the result of the function in the data model. The goal is to use it to call third-party libraries such as React JS or LocalStorage...
(**watcher** is the only item that is not designed to use functional programming).

```javascript
wu.create('watcher', 'setUserIdInLocalStorage', { // name of the watcher item
  onChange: {
    // path of the data model that we are watching
    paths: 'user.id',
    // 'fn' function will only be executed when the value of 'user.id' is a non-empty string
    check: {
      'user.id': [_.negate(_.isEmpty), _.isString]
    }
  },
  // arguments that will receive the function 'fn'
  from: 'user.id',
  // impure function that runs when 'onChange.paths' has changed
  fn: (userId) => {
    window.localStorage.setItem('userId', userId)
  }
})
```

### router:
**router** allows you to watch changes in the browser URL and save the normalized route in the data model.

```javascript
wu.create('router', 'userProfile', { // name of the router item
  // url pattern
  urlPattern: '/user/:userId/profile',
  // every time the URL changes 'user.profileRoute' value it will be updated
  to: 'user.profileRoute'
})

//  if the URL is '/user/asdf1234/profile' the value of 'user.profileRoute' will be:
//  {
//    isActive: true,
//    params: { userId: 'asdf1234' }
//  }

//  if the URL does not match '/user/:userId/profile' the value of 'user.profileRoute' will be:
//  {
//    isActive: false,
//    params: {}
//  }
```

### getter:
**getter** allows you to define an interface to get data from the data model outside of Wu. (Allows the use of functional programming).

```javascript
wu.create('getter', 'getGreeting', { // name of the getter item
  // arguments that will receive the function 'fn'
  from: ['user.name', 'user.lang'],
  // pure function
  fn: (userName, userLang) => {
    if (userLang === 'en') {
      return 'Hello ' + userName
    } else if (userLang === 'es') {
      return 'Hola ' + userName
    }
  }
})
```
[See ReactJS for more info.]('#ReactJS')

### setter:
**setter** allows you to define an interface to save data from outside to the Wu data model. (Allows the use of functional programming).

```javascript
wu.create('setter', 'sendUserLogin', { // name of the setter item
  // pure function
  fn: (email, password) => {
    return { email, password }
  },
  // path of the data model where the result of 'fn' will be saved
  to: 'user.login.data'
})

// when a third-party library (for example ReactJS) executes sendUserLogin('email@email.com', '12345678')
// the value of 'user.login.data' will be:
// {
//   email: 'email@email.com',
//   password: '12345678'
// }
```

### api:
**api** allows you to watch changes in the model and send Ajax requests to your server. When the server responses the request, **api** helps you manage it and save it in the data model. (Allows the use of functional programming).

```javascript
wu.create('api', 'userLogin', { // name of the api item
  onChange: {
    // path of the data model that we are watching
    paths: 'user.login.data',
    check: {
      // request will only be sent when the value of 'user.login.data.email' is an email
      'user.login.data.email': _.isEmail,
      // and value of 'user.login.data.password' is a non-empty string
      'user.login.data.password': [_.negate(_.isEmpty), _.isString]
    }
  },
  request: {
    // request method
    method: 'post',
    // request url or path
    path: 'https://server.com/api/login',
    // request post body
    body: {
      // request body will be an object like '{ email, password }'
      from: {
        email: 'user.login.data.email',
        password: 'user.login.data.password'
      }
    }
  },
  handlers: {
    // if response http code is 200
    onCode200: [
      {
        // save 'response.body' in 'user.profile' model data path
        fn: (response) => {
          return response.body
        },
        to: 'user.profile'
      }
    ],
    // if response http code is 404
    onCode404: [
      {
        // save this message in 'user.errorMessage' model data path
        fn: () => {
          return 'There is no user with this email and password in our database. Try other credentials please.'
        },
        to: 'user.errorMessage'
      }
    ]
  }
})
```

## Third-party libraries

It is very easy to work with third-party libraries using **getters**, **setters** and **watchers**.

### ReactJS

Wu allows you to use [React JS classes](https://reactjs.org) that are already integrated with the functionality of Wu.

```javascript
import React from 'react'
import WuComponent from 'wu/react-component'

export default class MyView extends WuComponent {
  // path of the data model that we are watching
  // when 'user.name' change in the data model this view will be rendered automatically
  onChange() {
    return ['user.name', 'user.lang']
  }
  render() {
    return (
      <div>
        { this.get('getGreeting') }
      </div>
    )
  }
}
```
[See 'getGreeting' getter for more info.]('#getter')

## Dependencies

Wu only has one dependency: [Loash](https://lodash.com)

## Current state of Wu

Wu is an experimental framework that is still in **beta**. The main purpose of Wu is to perform a proof of concept to compare this programming pattern with other patterns.

## Contributions

If you are interested in participating in the improvement or development of Wu please contact me: [@migueldelmazo](https://twitter.com/migueldelmazo). I would love for you to help me develop Wu.

I would especially like to receive suggestions about the names of the methods, so that they are more readable and easier to use.

## License

Wu is [MIT licensed](./docs/LICENSE.txt).
