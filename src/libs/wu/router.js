import _ from 'lodash'
import { wu, setInModel } from './common'
import { getDefinition, setDefinition } from './definition'

const updateModel = () => {
  wu.model.set('app.router', _.getWindowLocationData())
}

const run = (name) => {
  const definition = getDefinition('router', name)
  const router = wu.model.get('app.router')
  const result = {
    isActive: _.matchRouteParams(router.pathName, definition.urlPattern),
    params: _.getRouteParams(router.pathName, definition.urlPattern)
  }
  _.consoleGroup('router', 'Router: set ' + name, 'Result:', result)
  setInModel(definition, result)
  _.consoleGroupEnd()
}

export default {

  setDefinition: (name, definition) => {
    setDefinition('router', name, definition, {
      urlPattern: true,
      update: true
    })
  },

  watch: (name) => {
    wu.model.watch('app.router.url', run.bind(null, name), undefined, {
      type: 'ensurer'
    })
  },
  
  start: () => {
    _.initRouter(updateModel)
    updateModel()
  }

}
