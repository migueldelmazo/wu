import _ from 'lodash'

// atom

const atom = {
  action: {},
  api: {},
  ensure: {},
  getter: {},
  model: {
    __data: {},
    __listeners: {}
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

const initItem = (items, callback) => {
  _.each(items, (item, domain) => {
    _.each(item, (itemDefinition, nameDefinition) => {
      const name = domain + '.' + nameDefinition
      callback(name, itemDefinition)
    })
  })
}

export {
  atom,
  getDefinition,
  initItem
}
