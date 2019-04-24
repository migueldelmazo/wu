# Wu framework: public methods

* [`wu.create()`](#wucreate)
* [`wu.start()`](#wustart)
* [`wu.getter()`](#wugetter)
* [`wu.setter()`](#wusetter)

### `wu.create()`
This method allows you to create items of Wu to be used by other items of Wu or by third-party libraries.

**Arguments:**
* `type (string) [required]:` Type of item It can be `api`, `ensurer`, `watcher`, `router`, `getter` and `setter`.
* `name (string) [required]:` Name of the item. Used to be used by other items.
* `definition (object) [required]:` Declarative definition of the item. The documentation of each type of element is defined on its own page:
[API](./documentation-api.md), [ensurer](./documentation-ensurer.md), [watcher](./documentation-watcher.md), [router](./documentation-router.md), [getter](./documentation-getter.md) and [setter](./documentation-setter.md).

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

### `wu.start()`
* Start the Wu application:
  * Watch the events of the browser URL router.
  * Start some internal elements such as the API.
  * Set in the reactive data model `app.ready = true`, so that the items defined by you begin to react.

**Example of use:**
```javascript
wu.start()
```
___

### `wu.getter()`
Allows to execute `getters` previously defined with `wu.create(...)`
It is recommended to visit the [getter](./documentation-getter.md) documentation.

**Example of use:**
```javascript
wu.getter('shopGetOrders', { status: 'sent' })
```
___

### `wu.setter()`
Allows to execute `setters` previously defined with `wu.create(...)`
It is recommended to visit the [setter](./documentation-setter.md) documentation.

**Example of use:**
```javascript
wu.setter('paypalInitPayment', 100, '€')
```
