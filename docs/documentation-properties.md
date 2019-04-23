# Wu framework: properties documentation

Wu is a framework that uses **declarative programming**. The API, ensurer, watcher, router, getter and setter items use the same properties to define their behavior.

### Required, optional and not applicable properties

|            | API      | Ensurer  | Watcher  | Router   | Getter   | Setter   |
|------------|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|
| `onChange` | Required | Required | Required |          |          |          |
| `when`     | Optional | Optional | Optional |          |          |          |
| `args`     | Optional | Optional | Optional |          | Optional | Optional |
| `run`      | Optional | Optional | Required |          | Optional | Optional |
| `update`   | Required | Required |          | Required |          | Required |

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

### `when:`

* **Description:** before executing the function **run** it is validated that the conditions of **when** match.
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
    'user.age': (userAge) => userAge > 18 // custom function
  }
}
```

### `args:`

* **Description:** arguments with which the function is executed.
* **Type:** it can be any type of variable (array, boolean, number, object, string...).
* **Optional** in API, ensurer, watcher, getter and setter.
* **Order of arguments:** These arguments are the first ones that are passed to the function. In the case of **getters** and **setters**, the arguments passed from third-party libraries are passed to the function at the end.
* **String arguments are parsed** with the values of the data model, except if they start with the character `#`.

**Examples of use:**
```javascript
{
  args: ['user.email', 'user.email']
  // 'run' function will be executed with arguments: 'Anna', 'anna@gmail.com'
}
```

```javascript
{
  args: ['user.email', 'user.email', true, null, 1, [1, 2, 3] ]
  // 'run' function will be executed with arguments: 'Anna', 'anna@gmail.com', true, null, 1, [1, 2, 3]
}
```

```javascript
{
  args: {
    name: 'user.name',
    email: 'user.email',
    sendEmail: true
  }
  // 'run' function will be executed with arguments: { name: 'Anna', email: 'anna@gmail.com', sendEmail: true }
}
```

```javascript
{
  args: ['user.email', '#This is a string']
  // 'run' function will be executed with arguments: 'Anna', 'This is a string'
}
```

### `run:`

* **Description:** function to execute.
* **Type:** function.
* **Optional** in API, ensurer, getter and setter.
* **Required** in watcher.
* **By default** if the function is not specified, the default function is `(arg) => arg`. It means, the function returns the first argument that receives.
* **Order of arguments:** first the arguments defined in the property args. Then the arguments with which the function is called.
  * Third-party libraries can execute the function with their own arguments.
  * API handlers receive the response data and request data as the last parameters.
* **Functional programming:**
  * **Pure function:** we recommend pure functions in API, ensurer, getter and setter.
  * **Impure function:** in **watcher** the function must be impure because it is to execute functions of third-party libraries.

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

### `update:`

* **Description:**
  * In API, ensurer and setter is the path of the data model where to save the result of 'run'.
  * In router is the path of the data model where to save the router matches.
* **Type:** string.
* **Required** in API, ensurer, router and setter.

```javascript
{
  update: 'user.name'
}
```

## Console
