# Wu framework: Setter documentation
**Setter** allows you to define an interface to save data from outside to the Wu data model.
![Pattern](./wu-framework.png)

### Data flow:
Third-party libraries &#10148; Setter (pure function) &#10148; Reactive data model.

### Ensurer definition properties:
| Properties                                           | Required |
|:----------------------------------------------------:|:--------:|
| [`args`](./documentation-properties.md#args)         | Optional |
| [`run`](./documentation-properties.md#run)           | Optional |
| [`update`](./documentation-properties.md#update)     | Required |

### Example: passing all the arguments from third-party library
```javascript
// file user.js
wu.create('setter', 'userSendLoginData', { // name of the setter item
  // pure function
  run: (email, password) => {
    return {
      email,
      password
    }
  },
  // path of the data model where to save the result of 'run'
  update: 'user.login.data'
})
// file userLogin.template.js
sendLoginData () {
  wu.setter('userSendLoginData', 'email@email.com', '12345678')
}

// when 'sendLoginData' is executed 'user.login.data' will have { email: 'email@email.com', password: '12345678' }
```
### Example: passing first argument from data model and second argument from third-party library
```javascript
// file user.js
wu.create('setter', 'userSendLoginData', { // name of the setter item
  // arguments that will receive the function 'run'
  args: 'user.profile.email',
  // pure function
  run: (email, password) => {
    return {
      email,
      password
    }
  },
  // path of the data model where to save the result of 'run'
  update: 'user.login.data'
})
// file userLogin.template.js
sendLoginData () {
  wu.setter('userSendLoginData', '12345678')
}

// when 'sendLoginData' is executed 'user.login.data' will have { email: 'email@email.com', password: '12345678' }
```
