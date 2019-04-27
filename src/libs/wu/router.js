import _ from 'lodash'
import { wu, setInModel } from './common'
import { getDefinitions, setDefinition } from './definition'

// set app.router.location and set app.router.notFound

const updateModel = () => {
  wu.model.set('app.router', {
    location: _.getWindowLocationData(),
    notFound: !routerExists()
  })
}

const routerExists = () => {
  const location = _.getWindowLocationData()
  return _.some(getDefinitions('router'), (definition) => {
    return _.matchRouteParams(location.pathName, definition.urlPattern)
  })
}

// ensure routers

const run = () => {
  const router = wu.model.get('app.router.location')
  _.each(getDefinitions('router'), (definition, name) => {
    const result = {
      isActive: _.matchRouteParams(router.pathName, definition.urlPattern),
      params: _.getRouteParams(router.pathName, definition.urlPattern)
    }
    _.consoleGroup('router', 'Router: set ' + name, 'Result:', result)
    setInModel(definition, result)
    _.consoleGroupEnd()
  })
}

const watchRouter = () => {
  wu.model.watch('app.router.location', run, undefined, {
    type: 'ensurer'
  })
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
    watchRouter()
  }

}
