import _ from 'lodash'
import { atom, setDefinition, checkDefinitionType, checkDefinitionName } from './common'
import ensure from './ensure'
import model from './model'
import router from './router'
import watcher from './watcher'
import './lodash'

atom.model = model

atom.create = (type, name, definition) => {
  _.consoleGroup(type, 'Creating ' + type + ': ' + name, 'Definition:', definition)
  checkDefinitionType(type)
  checkDefinitionName(name)
  setDefinition(type, name, definition)
  switch (type) {
    case 'ensure':
      ensure.watch(name)
      break;
    case 'router':
      router.watch(name)
      break;
    case 'watcher':
      watcher.watch(name)
      break;
    default:
  }
  _.consoleGroupEnd()
}

atom.init = () => {
  router.init()
}

export default atom

window.atom = atom
