[Back to documentation](./documentation.md)

# Wu framework: properties documentation

Wu is a framework that uses **declarative programming**. The [API](./documentation-api.md), [ensurer](./documentation-ensurer.md), [watcher](./documentation-watcher.md), [router](./documentation-router.md), [getter](./documentation-getter.md) and [setter](./documentation-setter.md) items use the same properties to define their behavior.

### Required, optional and not applicable properties

|                         | [API](./documentation-api.md) | [Ensurer](./documentation-ensurer.md) | [Watcher](./documentation-watcher.md) | [Router](./documentation-router.md) | [Getter](./documentation-getter.md) | [Setter](./documentation-setter.md) |
|-------------------------|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|
| [`onChange`](#onchange) | Required | Required | Required | N/A      | N/A      | N/A      |
| [`when`](#when)         | Optional | Optional | Optional | N/A      | N/A      | N/A      |
| [`args`](#args)         | Optional | Optional | Optional | N/A      | Optional | Optional |
| [`run`](#run)           | Optional | Optional | Required | N/A      | Optional | Optional |
| [`update`](#update)     | Required | Required | N/A      | Required | N/A      | Required |

___

### `onChange:`

* **Description:** path(s) of the data model that we are watching.
* **Type:** string or array of strings.
* **Required** in API, ensurer and watcher.

**Examples of use:**
```javascript
{
  onChange: 'user.name'
}
```

```javascript
{
  onChange: ['user.name', 'user.lang']
}
```
___

### `when:`

* **Description:** before executing the function [`run`](#run) it is validated that the conditions of `when` match.
* **Type:** plain object where keys are data model paths and values are function or array of functions.
* **Optional** in API, ensurer and watcher.

**Examples of use:**
```javascript
{
  when: {
    'user.name': _.isString
  }
}
```

```javascript
{
  when: {
    'user.email': _.isEmail,
    'user.name': [_.negate(_.isEmpty), _.isString],
    'user.age': (userAge) => userAge >= 18 // custom function
  }
}
```
___

### `args:`

* **Description:** arguments with which the function is executed.
* **Type:** it can be any type of variable (array, boolean, number, object, string...).
* **Optional** in [API](./documentation-api.md), [ensurer](./documentation-ensurer.md), [watcher](./documentation-watcher.md), [getter](./documentation-getter.md) and [setter](./documentation-setter.md).
* **Order of arguments:** These arguments are the first ones that are passed to the function [`run`](#run). In the case of [getters](./documentation-getter.md) and [setters](./documentation-setter.md), the arguments passed from third-party libraries are passed to the function at the end.
* In case the arguments are **arrays, strings or objects**, the values of them are parsed **by replacing the strings with values of the data model** (except if the strings start with the character `#`).

**Examples of use:**
```javascript
{
  // 'run' function will be executed with arguments: 'Anna', 'anna@gmail.com'
  args: ['user.name', 'user.email']
}
```

```javascript
{
  // 'run' function will be executed with arguments: 'Anna', 'anna@gmail.com', true, null, 1, [1, 2, 3]
  args: ['user.name', 'user.email', true, null, 1, [1, 2, 3] ]
}
```

```javascript
{
  // 'run' function will be executed with arguments: { name: 'Anna', email: 'anna@gmail.com', sendEmail: true }
  args: {
    name: 'user.name',
    email: 'user.email',
    sendEmail: true
  }
}
```

```javascript
{
  // 'run' function will be executed with arguments: 'Anna', 'This is a string'
  args: ['user.email', '#This is a string']
}
```
___

### `run:`

* **Description:** function to execute.
* **Type:** function.
* **Required** in watcher.
* **Optional** in [API](./documentation-api.md), [ensurer](./documentation-ensurer.md), [getter](./documentation-getter.md) and [setter](./documentation-setter.md).
* **By default** if the function is not specified, the default function is `(arg) => arg`. It means, the function returns the first argument that receives.
* **Order of arguments:** first the arguments defined in the property args. Then the arguments with which the function is called.
  * Third-party libraries can execute the function with their own arguments.
  * [API](./documentation-api.md) handlers receive the response data and request data as the last parameters.
* **Functional programming:**
  * **Pure function:** we recommend pure functions in [API](./documentation-api.md), [ensurer](./documentation-ensurer.md), [getter](./documentation-getter.md) and [setter](./documentation-setter.md).
  * **Impure function:** in [watcher](./documentation-watcher.md) the function must be impure because it is to execute functions of third-party libraries.

```javascript
{
  args: ['user.name', 'user.lang'],
  run: (name, lang) => {
    if (lang === 'en') return 'Hello ' + name
    else if (lang === 'it') return 'Ciao ' + name
    else return 'Hola ' + name
  }
}
```
___

### `update:`

* **Description:**
  * In [API](./documentation-api.md), [ensurer](./documentation-ensurer.md) and [setter](./documentation-setter.md) is the path of the data model where to save the result of 'run'.
  * In [router](./documentation-router.md) is the path of the data model where to save the router matches.
* **Type:** string.
* **Required** in API, ensurer, router and setter.

```javascript
{
  update: 'user.name'
}
```
