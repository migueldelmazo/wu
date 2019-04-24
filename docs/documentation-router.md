# Wu framework: Router documentation
**Router** allows you to watch changes in the browser URL and save the normalized route in the data model.
The data stored in the model are the URL params and if the route is active.
The router updates the data model indicated by the path [`update`](./documentation-properties.md#update) with:
```javascript
{
  isActive: true, // or false
  params: {} // url pattern params
}
```
Also, in order for you to be able to get the URL data and watch the changes, when the browser URL changes,
the path of the data model `app.route` is updated with the following information:

```javascript
// when browser URL is https://localhost:3000/path?one=1#two 'app.route' is:
{
  hash: 'two',
  host: 'localhost:3000',
  hostname: 'localhost',
  pathName: '/path',
  port: '3000',
  protocol: 'https:',
  queryParams: {
    one: '1'
  },
  url: 'https://localhost:3000/path?one=1#two'
}
```
![Pattern](./wu-framework.png)

### Data flow:
Browser URL &#10148; Reactive data model.

### Router definition properties:
| Properties                                               | Required |
|:--------------------------------------------------------:|:--------:|
| [`urlPattern`](./documentation-properties.md#urlPattern) | Required |
| [`update`](./documentation-properties.md#update)         | Required |

### Examples
```javascript
wu.create('router', 'userLoginRoute', { // name of the router item
  urlPattern: '/user/login',
  update: 'user.login.route'
})

// when browser URL is '/user/login' 'user.login.route' is { isActive: true, params: {} }
// when browser URL is not '/user/login' 'user.login.route' is { isActive: false, params: {} }
```
```javascript
wu.create('router', 'userLoginRoute', { // name of the router item
  urlPattern: '/user/:userId/detail',
  update: 'user.detail.route'
})

// when browser URL is '/user/asdf1234/detail' 'user.detail.route' is { isActive: true, params: { userId: 'asdf1234' } }
// when browser URL is not '/user/asdf1234/detail' 'user.detail.route' is { isActive: false, params: {} }
```
