import _ from 'lodash'
import { wu, setInModel } from './common'
import { getDefinition } from './definition'

const updateModel = () => {
  wu.model.set('app.router', _.getWindowLocationData())
}

const run = (name) => {
  const definition = getDefinition('router', name)
  const router = wu.model.get('app.router')
  const result = {
    isValid: _.matchRouteParams(router.pathName, definition.urlPattern),
    params: _.getRouteParams(router.pathName, definition.urlPattern)
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
    wu.model.watch('app.router.url', undefined, run.bind(null, name), {
      type: 'ensurer'
    })
  }

}
