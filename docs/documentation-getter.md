# Wu framework: Getter documentation
**Getter** allows you to define an interface to get data from the data model outside of Wu.

### Data flow:
Reactive data model &#10148; Getter (pure function) &#10148; Third-party libraries.
![Pattern](./wu-framework.svg)

### Getter definition properties:
| Properties                                           | Required |
|:----------------------------------------------------:|:--------:|
| [`args`](./documentation-properties.md#args)         | Optional |
| [`run`](./documentation-properties.md#run)           | Optional |

### Example: passing all the arguments from the data model
```javascript
// file user.js
wu.create('getter', 'userGreeting', { // name of the getter item
  // arguments that will receive the function 'run'
  args: ['user.name', 'user.lang'],
  // pure function
  run: (name, lang) => {
    if (lang === 'en') return 'Hello ' + name
    else if (lang === 'it') return 'Ciao ' + name
    else return 'Hola ' + name
  }
})
// file userGreeting.template.js
render () {
  return (
    <h1>{wu.getter('userGreeting')}</h1>
  )
}

// when 'user.name' is 'Anna' and 'user.lang' is 'en' the result of render is '<h1>Hello Anna</h1>'
```
### Example: passing first argument from the data model and second argument from third-party library
```javascript
// file user.js
wu.create('getter', 'userGreeting', { // name of the getter item
  // arguments that will receive the function 'run'
  args: 'user.name',
  // pure function
  run: (name, lang) => {
    if (lang === 'en') return 'Hello ' + name
    else if (lang === 'it') return 'Ciao ' + name
    else return 'Hola ' + name
  }
})
// file userGreeting.template.js
render () {
  return (
    <h1>{wu.getter('userGreeting', 'en')}</h1>
  )
}

// when 'user.name' is 'Anna' and 'user.lang' is 'en' the result of render is '<h1>Hello Anna</h1>'
```
