import _ from 'lodash'
import { atom, getDefinition, setInModel } from './common'

const updateModel = () => {
  atom.model.set('app.router', _.getWindowLocationData())
}

const run = (name) => {
  const definition = getDefinition('router', name)
  const router = atom.model.get('app.router')
  const result = {
    isValid: _.matchRouteParams(router.pathName, definition.urlPathName),
    params: _.getRouteParams(router.pathName, definition.urlPathName)
  }
  _.consoleGroup('router', 'Router: set ' + name, 'Result:', result)
  setInModel(definition, result)
  _.consoleGroupEnd()
}

export default {

  start: () => {
    _.initRouter(updateModel)
    updateModel()
  },

  watch: (name) => {
    atom.model.watch('app.router.url', undefined, run.bind(null, name), {
      type: 'ensure'
    })
  }

}
