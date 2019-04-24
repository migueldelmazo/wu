# Wu framework: Watcher documentation
**Watcher** works exactly like [ensurer](./documentation-ensurer.md) but does not save the result of the function in the data model. The goal is to use it to **call third-party libraries such as React JS, LocalStorage, Stripe...**
![Pattern](./wu-framework.png)

### Data flow:
Reactive data model &#10148; Watcher (non-pure function) &#10148; Third-party libraries.

### Watcher definition properties:
| Properties                                           | Required |
|:----------------------------------------------------:|:--------:|
| [`onChange`](./documentation-properties.md#onchange) | Required |
| [`when`](./documentation-properties.md#when)         | Optional |
| [`args`](./documentation-properties.md#args)         | Optional |
| [`run`](./documentation-properties.md#run)           | Required |

### Example:
```javascript
wu.create('watcher', 'consoleLog', { // name of the watcher item
  // path of the data model that we are watching
  onChange: 'user.id',
  // arguments that will receive the function 'run'
  args: 'user.id',
  // impure function that runs when 'onChange' has changed
  run: (userId) => {
    console.log(userId)
  }
})

// when 'user.id' changes show in console its value
```
### Example with `when` property:
```javascript
wu.create('watcher', 'setUserIdInLocalStorage', { // name of the watcher item
  // path of the data model that we are watching
  onChange: 'user.id',
  // 'run' function will only be executed when the value of 'user.id' is a non-empty string
  when: {
    'user.id': [_.negate(_.isEmpty), _.isString]
  },
  // arguments that will receive the function 'run'
  args: 'user.id',
  // impure function that runs when 'onChange' has changed and 'when' conditions match
  run: (userId) => {
    window.localStorage.setItem('userId', userId)
  }
})

// when 'user.id' is 'asdf1234' or similar localStorage > userId is updated
```
