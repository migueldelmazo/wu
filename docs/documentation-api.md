# Wu framework: API documentation
**API** allows you to watch changes in the data model and send Ajax requests to your server. When the server responses, **API** helps you manage it and save it in the data model.
![Pattern](./wu-framework.svg)

### Data flow:
Reactive data model &#10148; API (pure functions) &#10148; Server &#10148; API (pure functions) &#10148; Reactive data model.

The flow that Wu performs with each API item is:
1. **You create an API item** that watchs a path in the data model with
  [`onChange`](./documentation-properties.md#onchange) and [`when`](./documentation-properties.md#when) properties.
2. **When the path changes** in the data model, Wu executes the API item:
   1. **Get all your [`request`](#request-property) data:** `method`, `path`, `query`, `body`, `headers` and [`context`](#optionscontext).
   2. **Add the API item to a call [`queue`](#queue).**
   3. When the call is ready to be sent:
     1. **Start the [`flags`](#optionsflags).**
     2. Check if the call **can be returned from [`cache`](#optionscacheable)** or
     3. **Send the request to the server** and wait for the response.
3. When the server response arrives:
   1. Run the [`onResponse`](#onresponse-property) handlers:
     1. Run the `onResponse.init` handler.
     2. Run the custom handler: `onResponse.status200`, `onResponse.status404`, `onResponse.status500`...
     3. Run the handler `onResponse.success` or `onResponse.error` (depending on the answer).
     4. Run the `onResponse.complete` handler.
   2. **Finish the [`flags`](#optionsflags)**.
   3. **Add the call to the [`cache`](#optionscacheable)** (if applicable).

### API definition properties:
| Properties                                           | Required |
|:----------------------------------------------------:|:--------:|
| [`onChange`](./documentation-properties.md#onchange) | Required |
| [`when`](./documentation-properties.md#when)         | Optional |
| [`request`](#request-property)                       | Required |
| [`onResponse`](#onresponse-property)                   | Required |
| [`options`](#options-property)                       | Optional |

#### Example:
```javascript
wu.create('api', 'getUserProfile', {
  onChange: 'user.id',
  request: {
    method: 'get',
    path: 'https://server.com/api/user/profile',
    query: {
      userId: 'user.id'
    }
  },
  onResponse: {
    status200: {
      run: (response) => response.body,
      update: 'user.profile'
    }
  },
  options: {
    cacheable: false
  }
})
```
___
### Request property:
The definition of the request is formed by:
* `method (string) [optional, 'GET' by default]:` request method.
* `path (string) [required]:` path request.
* `headers (object) [optional]:` headers request.
* `query (object) [optional]:` query request.
* `body (object) [optional]:` body request.

Each of these 5 properties can be:
* **An object formed by [`args`](./documentation-properties.md#args) or / and [`run`](./documentation-properties.md#run):**
in this case Wu gets the [`args`](./documentation-properties.md#args) from data model and executes the [`run`](./documentation-properties.md#run) function with them.
The result is the value of the property.
The function receives the [`context`](#optionscontext) as the last argument.
* **An array or plain object:** in this case Wu parses this property with data model values through
[`wu.model.populate()`](./documentation-public-model-methods.md#wumodelpopulate) method.
* **An string, number or boolean:** in this case this item is not modified.

```javascript
wu.create('api', 'getUserProfile', {
  onChange: 'user.id',
  request: {
    // 'path' is not modified because is a string
    path: 'https://server.com/api/user/profile',
    // Wu get 'args' from data model and run this function with this args to get 'query'
    query: {
      args: 'user.id',
      run: (userId) => {
        return {
          userId: userId
        }
      }
    },
    // Wu parses 'headers' with data model through 'wu.model.populate()' method
    headers: {
      authentication: 'user.authentication.token'
    }
  },
  onResponse: {}
})
```
___
### onResponse property:

* The `onResponse` property is formed by the handlers: `init`, `success`,
`error`, `complete` and custom handler (`status200`, `status404`, `status500`...).
* All these handlers are **optional**.
* All these handlers **can be an array**.
* All handlers can have the properties [`args`](./documentation-properties.md#args),
[`run`](./documentation-properties.md#run) and [`update`](./documentation-properties.md#update) properties.
* All [`run`](./documentation-properties.md#run) methods receive `response`, `request` and `options` as the last arguments.

See [`options.getHandler`](#optionsgethandler) to customize the handlers.

```javascript
wu.create('api', 'sendUserLogin', {
  onChange: 'user.id',
  request: {
    method: 'post',
    path: 'https://server.com/api/user/login',
    body: {
      email: 'user.email',
      password: 'user.password'
    }
  },
  onResponse: {
    // array handler, it always runs
    init: [
      {
        run: (response, request, options) => response.status,
        update: 'login.call.status'
      },
      {
        run: (response, request, options) => response.errorMessage,
        update: 'login.call.errorMessage'
      }
    ],
    // custom handler, it runs if the server returns a 200 status
    status200: {
      run: (response, request, options) => response.body,
      update: 'user.login.data'
    },
    // custom handler, it runs if the server returns a 404 status
    status404: {
      run: (response, request, options) => '',
      update: 'user.password'
    },
    // handler with data model args, it runs if the server responds correctly
    success: {
      args: 'user.name',
      run: (userName, response, request, options) => 'Welcome ' + userName,
      update: 'user.login.greeting'
    },
    // it runs if the server fails
    error: {
      run: (response, request, options) => 'Fatal error',
      update: 'app.message'
    },
    // it always runs
    complete: {
      run: (response, request, options) => true,
      update: 'login.call.isCompleted'
    }
  }
})
```
___
### Options property:
You can add the following options to the definition of your API:

#### `options.cacheable:`
Wu only caches the calls with **GET** method, **200 status code** and **without errors**.
If you do not want Wu to cache a call add the property `options.cacheable = false` to your API item.

```javascript
wu.create('api', 'sendUserLogin', {
  onChange: 'user.id',
  request: {
    path: 'https://server.com/api/user/profile',
  },
  onResponse: {
    success: {
      run: (response) => response.body,
      update: 'user.data'
    }
  },
  options: {
    cacheable: false
  }
})
```
___
#### `options.flags:`
A **simple way to know if a call is sending** is to add flags to an API element.
The same to know if the call went well, there were errors, what state code was returned...

To do this, indicate the path of the data model where you want each of these flags to be updated:
* `complete:` `false` when beginning the request and `true` when it responds.
* `error:` `false` when beginning the request and `true` if a fatal error occurs.
* `errorMessage:` empty string `''` when beginning the request and error message if it occurs
* `sending:` `true` when beginning the request and `false` when it responds.
* `success:` `false` when beginning the request and `true` if everything goes fine.
* `status:` empty string `''` when beginning the request and status code when it responds.

```javascript
wu.create('api', 'sendUserLogin', {
  onChange: 'user.id',
  request: {
    path: 'https://server.com/api/user/profile',
  },
  onResponse: {
    success: {
      run: (response) => response.body,
      update: 'user.data'
    }
  },
  options: {
    flags: {
      sending: 'user.login.sending',
      success: 'user.login.success',
      error: 'user.login.error',
      complete: 'user.login.complete',
      errorMessage: 'user.login.errorMessage',
      status: 'user.login.status'
    }
  }
})
```
___
#### `options.context:`
The **same API** item can be used **to send calls to the server with different data or to send several calls in parallel**.

To execute each of these calls with different values use `options.context` which is an object that can have the properties
[`when`](./documentation-properties.md#when) and [`run`](./documentation-properties.md#run).
The [`run`](./documentation-properties.md#run) function **must return an array**.
**A call will be sent to the server with each element of the array.**

The [`request`](#request-property) properties (`method`, `path`, `body`, `query` and `headers`)
receive each of these elements as the last argument.

The [`onResponse`](#onresponse-property) handlers (`init`, `success`, `error`, `complete`, `status200`...)
receive `options.context` as the last argument.

```javascript
wu.create('api', 'getUsers', {
  onChange: 'users',
  request: {
    // This call is executed once for each of the elements that are in 'users'
    path: {
      // options = { context: { user: {...} } }
      run: (options) => 'https://server.com/api/user/' + options.context.id
    }
  },
  onResponse: {
    success: {
      args: ['users'],
      // options = { context: { user: {...} } }
      run: (users = [], response, request, options) => {
        return users.map((user) => {
          if (user.id === options.context.id) {
            user.data = response.body
          }
          return user
        })
      },
      update: 'users'
    }
  },
  options: {
    // return an array
    context: {
      args: ['users'],
      run: (users) => users
    }
  }
})
```
___
#### `options.getHandler:`
If you want to **change the custom handler** you can do it by adding the object `options.getHandler`. This object can have the properties [`args`](./documentation-properties.md#args)
and [`run`](./documentation-properties.md#run). And also receives as last arguments `response`, `request` and `options`.

```javascript
wu.create('api', 'sendUserLogin', {
  onChange: 'user.id',
  request: {
    path: 'https://server.com/api/user/profile',
  },
  onResponse: {
    ok: {
      run: (response) => response.body,
      update: 'user.data'
    },
    ko: {
      run: (response) => ({}),
      update: 'user.data'
    }
  },
  options: {
    getHandler: {
      run: (response, request, options) => {
        return response.status === 200 ? 'ok' : 'ko'
      }
    }
  }
})
```
___
### `navigator.online:`
**Wu listens** to the property [`window.navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine)
**and updates `api.online` property of data model** each time your browser loses or recovers the Internet connection.
___
### Queue:
Calls to the server go through a queue before they are sent.

**Wu is a preventive system.** If you make **several calls in parallel** through the
**same API item and with the same [`request`](#request-property)** values,
**only the first one will be sent** to the server. The rest will be ignored.
