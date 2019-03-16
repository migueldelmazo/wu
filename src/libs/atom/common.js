import _ from 'lodash'

// atom

const atom = {
  api: {},
  ensure: {},
  getter: {},
  model: {
    _data: {},
    _listeners: {}
  },
  router: {}
}

window.atom = atom

// get item

const getDefinition = (type, name) => {
  const definition = _.get(atom, type + '.' + name)
  if (!definition) {
    _.consoleError('Atom: ' + type + '.' + name + ' do not exist')
  }
  return definition
}

// init item

const initDefinition = (items, callback) => {
  _.each(items, (item, domain) => {
    _.each(item, (itemDefinition, nameDefinition) => {
      const name = domain + '.' + nameDefinition
      callback(name, itemDefinition)
    })
  })
}

export { atom, getDefinition, initDefinition }
