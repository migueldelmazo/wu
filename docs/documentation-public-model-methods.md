# Wu framework: public model methods

ToDo: Explain how the model works

* [`wu.model.set()`](#wumodelset)
* [`wu.model.get()`](#wumodelget)
* [`wu.model.populate()`](#wumodelpopulate)
* [`wu.model.watch()`](#wumodelwatch)
* [`wu.model.stopWatching()`](#wumodelstopwatching)

### `wu.model.set()`
Set a value in a property of the data model.

**Arguments:**
* `path (string) [required]:` Path of property.
* `value (*) [required]:` Value.

**Example of use:**
```javascript
wu.model.set('user.profile.name', 'Anna')
```
___

### `wu.model.get()`
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

### `wu.model.populate()`
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

### `wu.model.watch()`
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

### `wu.model.stopWatching()`
Stop watching a path that has previously been watched by `wu.watch`.
Requires the identifier returned by `wu.watch`.

**Arguments:**
* `watcherId (string) [required]:` Watcher identifier.

**Example of use:**
```javascript
const watcherId = wu.model.watch('user.id', myFunction)
wu.model.stopWatching(watcherId)
```
