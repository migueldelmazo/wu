[Back to documentation](./documentation.md)

# Wu framework: public methods

* [`wu.create(type, name, definition)`](#wu-framework-public-methods)
* [`wu.start()`](#wustart)
* [`wu.getter(name, ...args) / wu.setter(name, ...args)`](#wugettername-args--wusettername-args)
* [`wu.model.set(path, value)`](#wumodelsetpath-value)
* [`wu.model.get(path, defaultValue)`](#wumodelgetpath-defaultvalue)
* [`wu.model.watch(paths, fns, validators)`](#wumodelwatchpaths-fns-validators)
* [`wu.model.stopWatching(watcherId)`](#wumodelstopwatchingwatcherid)

## `wu.create(type, name, definition)`
This method allows you to create items of Wu to be used by other items of Wu or by third-party libraries.

**Arguments:**
* `type (string) [required]:` Type of item It can be `api`, `ensurer`, `watcher`, `router`, `getter` and `setter`.
* `name (string) [required]:` Name of the item. Used to be used by other items.
* `definition (object) [required]:` Declarative definition of the item. The documentation of each type of element is defined on its own page:
  * [API](./documentation-api.md)
  * [ensurer](./documentation-ensurer.md)
  * [watcher](./documentation-watcher.md)
  * [router](./documentation-router.md)
  * [getter](./documentation-getter.md)
  * [setter](./documentation-setter.md)

**Example of use:**
```javascript
wu.create('ensurer', 'userLogin', {
  onChange: 'app.ready',
  args: ['user.email', 'user.password'],
  run: (userEmail, userPassword) => {
    return {
      email: userEmail,
      password: userPassword
    }
  },
  update: 'user.login.data'
})
```
___

## `wu.start()`
* Start the Wu application:
  * Watch the events of the browser URL router.
  * Start some internal elements such as the API.
  * Set in the reactive data model `app.ready = true`, so that the items defined by you begin to react.

**Example of use:**
```javascript
wu.start()
```
___

## `wu.getter(name, ...args) / wu.setter(name, ...args)`
Allows to execute `getters` and `setters` previously defined with `wu.create(...)`
It is recommended to visit the documentation of [getter](./documentation-getter.md) and [setter](./documentation-setter.md).

**Example of use:**
```javascript
wu.getter('shopGetOrders', { status: 'sent' })
```
```javascript
wu.setter('paypalInitPayment', 100, '€')
```
___

## `wu.model.set(path, value)`
Set a value in a property of the data model.

**Arguments:**
* `path (string) [required]:` Path of property.
* `value (*) [required]:` Value.

**Example of use:**
```javascript
wu.model.set('user.profile.name', 'Anna')
```
___

## `wu.model.get(path, defaultValue)`
Return the value of a property of the data model. The value is cloned before being returned so that the data model can not be modified by mistake.

**Arguments:**
* `path (string) [required]:` Path of property.
* `defaultValue (*) [optional]:` Value returned if the property does not exist or is `undefined`.

**Return:**
* `(*)` Value of a property of the data model or default value.

**Example of use:**
```javascript
wu.model.get('user.profile.name', '') // 'Anna'
```
___

## `wu.model.populate(data)`
Iterate and return an object and if its values are a strings, it parses them with the values of the data model.
If the string starts with `#` do not parse it.

**Arguments:**
* `data (*) [required]:` Data to parse.

**Return:**
* `(*)` Parsed object.

**Example of use:**
```javascript
wu.model.populate('user.profile.name') // 'Anna'
wu.model.populate({ email: 'user.profile.name' }) // { email: 'Anna' }
wu.model.populate({ email: 'user.profile.name' }) // { email: 'Anna' }
wu.model.populate({ email: 'user.profile.name', foo: '#user.profile.name' }) // { email: 'Anna', foo: 'user.profile.name' }
wu.model.populate({ email: 'user.profile.name', number: 123 }) // { email: 'Anna', number: 123 }
wu.model.populate(['user.profile.name']) // ['Anna']
wu.model.populate(['user.profile.name', '#user.profile.name']) // ['Anna', 'user.profile.name']
wu.model.populate(['user.profile.name', 1, true, null, undefined]) // ['Anna', 1, true, null, undefined]
```
___

## `wu.model.watch(paths, fns, validators)`
Start watching some paths of the data model and run the functions when the values change.

**Arguments:**
* `paths (string|array of strings) [required]:` Watched paths.
* `fns (function|array of functions) [required]:` Functions to execute when the `paths` change and the values fullfill the `validators`.
* `validators (object) [optional]:` Validations that the `paths` have to fulfill in order for the functions to be executed.

**Return:**
* `(string)` A watcher identifier in case you want to stop watching these paths.

**Example of use:**
```javascript
wu.model.watch(
  'user.id',
  {
    'user.name': [_.negate(_.isEmpty), _.isString],
    'user.age': _.isNumber,
    'user.status': (status) => status === 'ready'
  },
  () => {
    const userId = wu.model.get('user.id')
    window.localStorage('userId', userId)
  }
)
```
___

## `wu.model.stopWatching(watcherId)`
Stop watching a path that has previously been watched by `wu.watch`.
Requires the identifier returned by `wu.watch`.

**Arguments:**
* `watcherId (string) [required]:` Watcher identifier.

**Example of use:**
```javascript
const watcherId = wu.model.watch('user.id', myFunction)
wu.model.stopWatching(watcherId)
```
