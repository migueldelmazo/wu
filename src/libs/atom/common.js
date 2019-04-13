import _ from 'lodash'

const atom = {
  _private: {}
}

const getDefinition = (type, name) => {
  const definition = _.get(atom._private, 'items.' + type + '.' + name)
  if (!definition) {
    _.consoleError('atom.getDefinition invalid definition, type: ' + type + ', name: ' + name)
  }
  return definition
}

const setDefinition = (type, name, definition) => {
  _.set(atom._private, 'items.' + type + '.' + name, definition)
}

const checkDefinitionType = (type) => {
  const validTypes = ['api', 'ensure', 'getter', 'router', 'watcher']
  if (validTypes.indexOf(type) < 0) {
    _.consoleError('atom.create invalid type:', type)
  }
}

const checkDefinitionName = (name) => {
  if (_.isEmpty(name) || !_.isString(name)) {
    _.consoleError('atom.create invalid name:', name)
  }
}

export {
  atom,
  getDefinition,
  setDefinition,
  checkDefinitionType,
  checkDefinitionName
}

window.atom = atom
