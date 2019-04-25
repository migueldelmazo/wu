import _ from 'lodash'
import { wu, setInModel } from './common'
import { getDefinitions, setDefinition } from './definition'

const updateModel = () => {
  wu.model.set('app.router', _.getWindowLocationData())
}

const run = () => {
  const currentRouter = wu.model.get('app.router')
  const found = _.some(getDefinitions('router'), (definition, name) => {
    const result = getRouteMatches(definition, currentRouter)
    _.consoleGroup('router', 'Router: set ' + name, 'Result:', result)
    setInModel(definition, result)
    _.consoleGroupEnd()
    return result.isActive
  })
  wu.model.set('app.router.found', found)
}

const getRouteMatches = (definition, router) => {
  return {
    isActive: _.matchRouteParams(router.pathName, definition.urlPattern),
    params: _.getRouteParams(router.pathName, definition.urlPattern)
  }
}

export default {

  setDefinition: (name, definition) => {
    setDefinition('router', name, definition, {
      urlPattern: true,
      update: true
    })
  },
  
  start: () => {
    _.initRouter(updateModel)
    updateModel()
    wu.model.watch('app.router.url', run, undefined, {
      type: 'ensurer'
    })
  }

}
