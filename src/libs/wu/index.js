import _ from 'lodash'
import { wu } from './common'
import { checkDefinitionType } from './definition'
import api from './api'
import ensurer from './ensurer'
import getter from './getter'
import model from './model'
import router from './router'
import setter from './setter'
import watcher from './watcher'
import './lodash'

wu.create = (type, name, definition) => {
  switch (type) {
    case 'api':
      api.setDefinition(name, definition)
      api.watch(name)
      break;
    case 'ensurer':
      ensurer.setDefinition(name, definition)
      ensurer.watch(name)
      break;
    case 'getter':
      getter.setDefinition(name, definition)
      break;
    case 'router':
      router.setDefinition(name, definition)
      break;
    case 'setter':
      setter.setDefinition(name, definition)
      break;
    case 'watcher':
      watcher.setDefinition(name, definition)
      watcher.watch(name)
      break;
    default:
      checkDefinitionType(type, name, definition)
  }
}

wu.getter = getter.getter
wu.setter = setter.setter
wu.model = model

wu.start = () => {
  _.consoleGroup('wu', 'Starting Wu')
  api.start()
  router.start()
  wu.model.set('app.ready', true)
  _.consoleGroupEnd()
}

export default wu

if (process.env.NODE_ENV === 'development') {
  window.wu = wu
}
