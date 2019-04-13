import _ from 'lodash'
import React from 'react'
import atom from '../atom'

// state

const wrapSetStateMethod = function() {
  this.setState = _.wrap(this.setState, function(setStateMethod, path, value) {
    const obj = _.isPlainObject(path) ? path : _.set({}, path, value),
      newState = _.extend({}, this.state, obj)
    if (!_.isEqual(this.state, newState)) {
      _.consoleLog('react', 'React: run ' + this.getName('name') + '.setState', 'Data:', obj)
      setStateMethod.call(this, obj)
    }
  })
}

// state and props parser

const parser = function (value) {
  if (_.isString(value)) {
    if (_.startsWith(value, '#this.props.')) {
      value = value.replace('#this.props.', '')
      return _.get(this.props, value)
    } else if (_.startsWith(value, '#this.state.')) {
      value = value.replace('#this.state.', '')
      return this.getState(value)
    }
  }
  return value
}

// atom Watchers

const watchAtom = function () {
  const watchers = this.watchers()
  this.atomWatcherKey = atom._private.model.watch(watchers, function () {
    _.consoleLog('react', 'React: render ' + this.getName('name'), 'Watchers:', watchers)
    this.forceUpdate()
  }.bind(this))
}

const stopWatchingAtom = function () {
  atom.model.stopWatching(this.atomWatcherKey)
}

// run methods

const runMethod = function (method, ...args) {
  const parsedArgs = _.mapDeep(args, null, parser.bind(this))
  _.consoleGroup('react', 'React: run ' + this.getName() + '.' + method, 'Args:', ...parsedArgs)
  this[method](...parsedArgs)
  _.consoleGroupEnd()
}

// input

const getInputValue = (ev) => {
  const target = ev.target
  if (target.tagName === 'INPUT') {
    if (target.type === 'checkbox' || target.type === 'radio') {
      return target.checked
    }
    if (target.type !== 'button' && target.type !== 'submit') {
      return target.value
    }
  }
}

export default class Component extends React.Component {

  constructor(props) {
    super(props)
    this.state = this.initialState()
    wrapSetStateMethod.call(this)
  }

  componentDidMount() {
    watchAtom.call(this)
  }

  componentWillUnmount() {
    stopWatchingAtom.call(this)
  }
  
  getName() {
    return this.constructor.name
  }
  
  watchers() {
    return []
  }

  // state
  
  initialState() {
    return {}
  }
  
  getState(path, defaultValue) {
    return _.get(this.state, path, defaultValue)
  }
  
  toggleState(path, value) {
    value = value === undefined ? !this.getState(path) : !!value
    this.setState(path, value)
  }

  // events

  onEv(...args) {
    return function(ev) {
      const eventValue = getInputValue(ev)
      const methodsArgs = _.isString(args[0]) ? [args] : args
      _.each(methodsArgs, (methodsArgs) => {
        if (eventValue === undefined) {
          runMethod.apply(this, methodsArgs)
        } else {
          runMethod.apply(this, methodsArgs.concat(eventValue))
        }
      })
    }.bind(this)
  }
  
  // class name
  
  getClassName(status, trueClass = '', falseClass = '', prefixClass = '', sufixClass = '') {
    return prefixClass + (status ? trueClass : falseClass) + sufixClass
  }

}
