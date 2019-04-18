import _ from 'lodash'
import { wu, checkDefinitionType, setDefinition } from './common'
import api from './api'
import ensure from './ensure'
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
    case 'ensure':
      setDefinition(type, name, definition, {
        onChange: true,
        from: false,
        fn: false,
        to: true
      })
      ensure.watch(name)
      break;
    case 'getter':
      setDefinition(type, name, definition, {
        from: false,
        fn: false
      })
      break;
    case 'router':
      setDefinition(type, name, definition, {
        urlPathName: true,
        to: true
      })
      router.watch(name)
      break;
    case 'setter':
      setDefinition(type, name, definition, {
        from: false,
        fn: false,
        to: true
      })
      break;
    case 'watcher':
      setDefinition(type, name, definition, {
        onChange: true,
        from: false,
        fn: true
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
