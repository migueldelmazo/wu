import _ from 'lodash'

const wu = {
  _private: {
    items: {}
  }
}

// run function

const runFn = (definition, ...fnArgs) => {
  let modelArgs = definition.args ? wu.model.populate(definition.args) : []
  modelArgs = _.parseArray(modelArgs)
  return _.isFunction(definition.run) ? definition.run(...modelArgs, ...fnArgs) : modelArgs[0]
}

// set in model

const setInModel = (definition, value) => {
  wu.model.set(definition.to, value)
}

// get definition

const getDefinition = (type, name) => {
  return wu._private.items[type][name]
}

// set definition

const setDefinition = (type, name, definition, props) => {
  checkDefinitionName(type, name)
  checkDefinition(type, name, definition)
  checkDefinitionProps(type, name, definition, props)
  wu._private.items[type] = wu._private.items[type] || {}
  wu._private.items[type][name] = parseDefinition(definition, props)
  _.consoleLog(type, _.capitalize(type) + ': create ' + name, 'Definition:', getDefinition(type, name))
}

const checkDefinitionType = (type, name) => {
  _.consoleError('Invalid type in wu.create(\'' + type + '\', \'' + name + '\', {...}). Type should be api, ensurer, getter, router, setter or watcher.')
}

const checkDefinitionName = (type, name) => {
  if (_.isEmpty(name) || !_.isString(name)) {
    showError('Invalid name in', type, name, '{...}', 'Name should be a string.')
  }
}

const checkDefinition = (type, name, definition) => {
  if (!_.isPlainObject(definition)) {
    showError('Invalid definition in', type, name, definition, 'Definition should be an object.')
  }
}

const checkDefinitionProps = (type, name, definition, props) => {
  _.each(props, (isRequired, prop) => checkDefinitionProp(type, name, definition, prop, isRequired))
}

const checkDefinitionProp = (type, name, definition, prop, isRequired) => {
  const value = definition[prop]
  if (value === undefined && isRequired) {
    return showError('Required ' + prop + ' property in', type, name, '{...}')
  } else if (isRequired) {
    if (prop === 'onChange' && !_.isPlainObject(value)) {
      showError('Invalid "onChange" property in', type, name, '{...}', '"onChange" should be an object.')
    }
    if (prop === 'run' && !_.isFunction(value)) {
      showError('Invalid "run" property in', type, name, '{...}', '"run" should be a function.')
    }
    if (prop === 'to' && !_.isString(value)) {
      showError('Invalid "to" property in', type, name, '{...}', '"to" should be a string.')
    }
    if (prop === 'urlPattern' && !_.isString(value)) {
      showError('Invalid "urlPattern" property in', type, name, '{...}', '"urlPattern" should be a string like "/user" or "/user/:userId".')
    }
  }
}

const showError = (prefix, type, name, definition, sufix = '') => {
  _.consoleError(prefix + ' wu.create(\'' + type + '\', \'' + name + '\', ' + definition + '). ' + sufix)
}

const parseDefinition = (definition, props) => {
  return _.pick(definition, _.keys(props))
}

export { wu, checkDefinitionType, getDefinition, setDefinition, runFn, setInModel }

window.wu = wu
