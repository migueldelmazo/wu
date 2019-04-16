import _ from 'lodash'
import { atom, getDefinition } from './common'

const updateModel = () => {
  atom.model.set('app.router', _.getWindowLocationData())
}

const ensureModelRoute = (name) => {
  const definition = getDefinition('router', name)
  const router = _.first(atom.model.getValues('app.router'))
  _.consoleGroup('router', 'Router: set ' + name, 'Definition:', definition)
  atom.model.set(definition.destination, {
    isValid: _.matchRouteParams(router.pathName, definition.urlPathName),
    params: _.getRouteParams(router.pathName, definition.urlPathName)
  })
  _.consoleGroupEnd()
}

export default {

  init: () => {
    _.initRouter(updateModel)
    updateModel()
  },

  watch: (name) => {
    atom._private.model.watch('app.router.url', ensureModelRoute.bind(null, name), undefined, {
      type: 'ensure'
    })
  }

}
