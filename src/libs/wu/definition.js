import _ from 'lodash'
import { wu } from './common'

// get definition

const getDefinition = (type, name) => {
  if (_.has(wu._private.items[type], name)) {
    return _.cloneDeep(wu._private.items[type][name])
  } else {
    showError('Definition not found in', type, name, '{...}')
  }
}

const getDefinitions = (type) => {
  return wu._private.items[type] || {}
}

// set definition

const setDefinition = (type, name, definition, props) => {
  if (checkDefinitionName(type, name) &&
    checkDefinition(type, name, definition) &&
    isValidDefinitionProps(type, name, definition, props)) {
    wu._private.items[type] = wu._private.items[type] || {}
    wu._private.items[type][name] = parseDefinition(definition, props)
    _.consoleLog(type, _.capitalize(type) + ': create ' + name, 'Definition:', getDefinition(type, name))
  }
}

const checkDefinitionType = (type, name) => {
  const validTypes = ['api', 'ensurer', 'getter', 'router', 'setter', 'watcher']
  if (validTypes.indexOf(type) < 0) {
    return showError('Invalid type in', type, name, '{...}', 'Type should be api, ensurer, getter, router, setter or watcher.')
  }
  return true
}

const checkDefinitionName = (type, name) => {
  if (_.isEmpty(name) || !_.isString(name)) {
    return showError('Invalid name in', type, name, '{...}', 'Name should be a string.')
  }
  return true
}

const checkDefinition = (type, name, definition) => {
  if (!_.isPlainObject(definition)) {
    return showError('Invalid definition in', type, name, definition, 'Definition should be an object.')
  }
  return true
}

const isValidDefinitionProps = (type, name, definition, props) => {
  return _.every(props, (isRequired, prop) => isValidDefinitionProp(type, name, definition, prop, isRequired))
}

const isValidDefinitionProp = (type, name, definition, prop, isRequired) => {
  const value = definition[prop]
  if (value === undefined && isRequired) {
    return showError('Required ' + prop + ' property in', type, name, '{...}')
  } else if (value !== undefined) {
    if (prop === 'onChange' && !_.isArray(value) && !_.isString(value)) {
      return showError('Invalid "onChange" property in', type, name, '{...}', '"onChange" should be a string or an array of strings.')
    }
    if (prop === 'run' && !_.isFunction(value)) {
      return showError('Invalid "run" property in', type, name, '{...}', '"run" should be a function.')
    }
    if (prop === 'update' && !_.isString(value)) {
      return showError('Invalid "update" property in', type, name, '{...}', '"update" should be a string.')
    }
    if (prop === 'urlPattern' && !_.isString(value)) {
      return showError('Invalid "urlPattern" property in', type, name, '{...}', '"urlPattern" should be a string like "/user" or "/user/:userId".')
    }
    if (prop === 'when' && !_.isPlainObject(value) && !_.every(value, (fns) => _.every(_.parseArray(fns), _.isFunction))) {
      return showError('Invalid "when" property in', type, name, '{...}',
        '"when" should should be an object like:\n{\n\t\'path.of.model\': validatorFunction,\n\t\'other.path.of.model\': [_.isNotEmpty, _.isString]\n}')
    }
  }
  return true
}

const showError = (prefix, type, name, definition, sufix = '') => {
  _.consoleError(prefix + ' wu.create(\'' + type + '\', \'' + name + '\', ' + definition + '). ' + sufix)
  return false
}

const parseDefinition = (definition, props) => {
  return _.pick(definition, _.keys(props))
}

export { checkDefinitionType, getDefinition, getDefinitions, setDefinition }

window.wu = wu
