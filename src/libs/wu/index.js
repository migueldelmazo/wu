import _ from 'lodash'
import { wu } from './common'
import { checkDefinitionType, setDefinition } from './definition'
import api from './api'
import ensurer from './ensurer'
import getter from './getter'
import model from './model'
import router from './router'
import setter from './setter'
import watcher from './watcher'
import './lodash'

wu.getter = getter
wu.setter = setter
wu.model = model

wu.create = (type, name, definition) => {
  switch (type) {
    case 'api':
      setDefinition(type, name, definition, {
        onChange: true,
        request: true,
        handlers: true,
        flags: false
      })
      api.watch(name)
      break;
    case 'ensurer':
      setDefinition(type, name, definition, {
        onChange: true,
        args: false,
        run: false,
        to: true
      })
      ensurer.watch(name)
      break;
    case 'getter':
      setDefinition(type, name, definition, {
        args: false,
        run: false
      })
      break;
    case 'router':
      setDefinition(type, name, definition, {
        urlPattern: true,
        to: true
      })
      router.watch(name)
      break;
    case 'setter':
      setDefinition(type, name, definition, {
        args: false,
        run: false,
        to: true
      })
      break;
    case 'watcher':
      setDefinition(type, name, definition, {
        onChange: true,
        args: false,
        run: true
      })
      watcher.watch(name)
      break;
    default:
      checkDefinitionType(type, name, definition)
  }
}

wu.start = () => {
  _.consoleGroup('wu', 'Starting Wu')
  api.start()
  router.start()
  wu.model.set('app.ready', true)
  _.consoleGroupEnd()
}

export default wu

window.wu = wu
