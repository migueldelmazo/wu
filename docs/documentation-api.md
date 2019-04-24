# Wu framework: API documentation
**API** allows you to execute a function and save its result in the data model every time other data change. The goal is to always keep the data model consistent.
![Pattern](./wu-framework.png)

### Data flow:
Reactive data model &#10148; API (pure functions) &#10148; Server &#10148; API (pure functions) &#10148; Reactive data model.

### API definition properties:
| Properties                                           | Required |
|:----------------------------------------------------:|:--------:|
| [`onChange`](./documentation-properties.md#onchange) | Required |
| [`when`](./documentation-properties.md#when)         | Optional |
| [`args`](./documentation-properties.md#args)         | Optional |
| [`run`](./documentation-properties.md#run)           | Optional |
| [`update`](./documentation-properties.md#update)     | Required |

### Example:
```javascript
wu.create('api', 'userIsLogged', { // name of the api item
  // path of the data model that we are watching
  onChange: 'user.id',
  // arguments that will receive the function 'run'
  args: 'user.id',
  // pure function that runs when 'onChange' has changed
  run: (userId) => !!userId,
  // path of the data model where to save the result of 'run'
  update: 'user.isLogged'
})

// when 'user.id' is '', undefined, null... 'user.isLogged' is false
// when 'user.id' is 'asdf1234' or similar 'user.isLogged' is true
```
### Example with `when` property:
```javascript
wu.create('ensure', 'userGreeting', { // name of the api item
  // path of the data model that we are watching
  onChange: ['user.name', 'user.lang'],
  // 'run' function will only be executed when the value of 'user.name' is a non-empty string
  // and the value of 'user.lang' is a string of length = 2
  when: {
    'user.name': [_.negate(_.isEmpty), _.isString],
    'user.lang': [_.isString, (userLang) => _.size(userLang) === 2]
  },
  // arguments that will receive the function 'run'
  args: ['user.name', 'user.lang'],
  // pure function that runs when 'onChange' has changed and 'when' conditions match
  run: (name, lang) => {
    if (lang === 'en') return 'Hello ' + name
    else if (lang === 'it') return 'Ciao ' + name
    else return 'Hola ' + name
  },
  // path of the data model where to save the result of 'run'
  update: 'user.greeting'
})

// when 'user.name' is 'Anna' and 'user.lang' is 'en' 'user.greeting' is 'Hello Anna'
// when 'user.name' is 'Anna' and 'user.lang' is 'it' 'user.greeting' is 'Ciao Anna'
// when 'user.name' is 'Anna' and 'user.lang' is 'XX' 'user.greeting' is 'Hola Anna'
```
