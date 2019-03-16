import _ from 'lodash'
import React from 'react'
import atom from '../atom'

const wrapSetStateMethod = function() {
  this.setState = _.wrap(this.setState, function(setStateMethod, path, value) {
    const obj = _.isPlainObject(path) ? path : _.set({}, path, value),
      newState = _.extend({}, this.state, obj)
    if (!_.isEqual(this.state, newState)) {
      setStateMethod.call(this, obj)
    }
  })
}

export default class Component extends React.Component {

  constructor(props) {
    super(props)
    wrapSetStateMethod.call(this)
    this.state = this._getInitialState()
  }

  componentDidMount() {
    this._watchAtomListeners()
  }

  componentWillUnmount() {
    this._offAtomListeners()
  }

  // config

  _getConfigItem(name, defaultValue = undefined) {
    const config = this.getConfig() || {}
    return config[name] === undefined ? defaultValue : config[name]
  }

  // atom listeners

  _watchAtomListeners() {
    const listeners = _.parseArray(this._getConfigItem('listeners'))
    this.atomListenerKey = atom.model.watch(listeners, this.forceRender.bind(this, listeners))
  }

  _offAtomListeners() {
    atom.model.off(this.atomListenerKey)
  }

  // render

  render() {
    return this.rndr()
  }

  rndr() {
    _.consoleError('React: have to define rndr method in ' + this._getConfigItem('listeners') + ' view')
    return <div />
  }

  forceRender(listeners) {
    _.consoleLog('react', 'Render ' + this._getConfigItem('name'), 'On listen: ', listeners)
    this.forceUpdate()
  }

  // events

  onEvent(method, ...args) {
    return function(ev) {
      const parsedArgs = _.parseDeepValues(args, this._parser.bind(this))
      _.consoleGroup('react', 'View ' + this._getConfigItem('name') + ': run onEvent with method ' + method, 'Args:', ...parsedArgs)
      this[method](...parsedArgs)
      _.consoleGroupEnd()
    }.bind(this)
  }

  stopEvent(ev) {
    if (ev) {
      ev.preventDefault()
      ev.stopPropagation()
    }
  }

  // state

  _getInitialState() {
    return this._getConfigItem('state', {})
  }

  getState(path, defaultValue) {
    return _.get(this.state, path, defaultValue)
  }

  toggleState(path, value) {
    this.setState(path, value === undefined ? !this.getState(path) : value)
  }

  // parser

  _parser(value) {
    if (_.isString(value)) {
      if (value.indexOf('#this.props.') === 0) {
        value = value.replace('#this.props.', '')
        return _.get(this.props, value)
      } else if (value.indexOf('#this.state.') === 0) {
        value = value.replace('#this.state.', '')
        return this.getState(value)
      }
    }
    return value
  }

  // class name

  getClassName(status, trueClass = '', falseClass = '', prefixClass = '', sufixClass = '') {
    return prefixClass + (status ? trueClass : falseClass) + sufixClass
  }

}
