import _ from 'lodash'
import { atom, getDefinition } from './common'

const updateModel = () => {
  atom.model.set('router', _.getWindowLocationData())
}

const ensureModelRoute = (name) => {
  const definition = getDefinition('router', name)
  const router = _.first(atom.model.getValues('router'))
  atom.model.set(definition.destination, {
    isValid: _.matchRouteParams(router.pathName, definition.urlPathName),
    params: _.getRouteParams(router.pathName, definition.urlPathName)
  })
}

export default {

  init: () => {
    _.initRouter(updateModel)
    updateModel()
  },

  watch: (name) => {
    atom._private.model.watch('router.url', ensureModelRoute.bind(null, name), {
      type: 'ensure'
    })
  }

}
