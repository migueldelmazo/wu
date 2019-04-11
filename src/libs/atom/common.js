import _ from 'lodash'

const atom = {
  _private: {}
}

const getDefinition = (type, name) => {
  return _.get(atom._private, 'items.' + type + '.' + name)
}

const setDefinition = (type, name, definition) => {
  _.set(atom._private, 'items.' + type + '.' + name, definition)
}

const checkDefinitionType = (type) => {
  const validTypes = ['api', 'ensure', 'router', 'watcher']
  if (validTypes.indexOf(type) < 0) {
    _.consoleError('atom.create invalid type', type)
  }
}

const checkDefinitionName = (name) => {
  if (_.isEmpty(name) || !_.isString(name)) {
    _.consoleError('atom.create invalid name', name)
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
