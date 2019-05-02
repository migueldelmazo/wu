# Third-party libraries

It is very easy to work with third-party libraries using [getters](./documentation-getter.md), [setters](./documentation-setter.md) and [watchers](./documentation-watcher.md).

## [React JS](https://github.com/migueldelmazo/wu-reactjs)
We have developed a module in **React JS that integrates with Wu**, and that allows:

**Render a view automatically** when a property of the data model changes, through `onChange` method.
```javascript
onChange () {
  return 'user.name'
}
```
Use [getter](./documentation-getter.md) and [setter](./documentation-setter.md) created in Wu directly from the view, like:
```javascript
<p>User name: { this.get('userName') }</p>
```
Use the state or the props to execute a method (from your view or external) through shortcuts:
```javascript
<button onClick={ this.onEv('userSendLogin', '#state.email', '#state.password') }>Login</button>
```
See this module at https://github.com/migueldelmazo/wu-reactjs.
