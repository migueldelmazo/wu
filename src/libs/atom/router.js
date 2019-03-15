import _ from 'lodash'
import { atom } from './common'

// url

const isAnchorWithHref = (ev) => {
  return ev.srcElement.tagName === 'A' && _.isString(ev.srcElement.href)
}

const replaceUrl = (url) => {
  window.history.pushState({}, '', url)
}

// update atom.model.set('route...')

const updateModel = () => {
  const location = window.location
  atom.model.set('router', {
    url: location.href,
    pathName: location.pathname,
    hash: location.hash.substr(1),
    queryParams: _.queryParams2object(location.href)
  })
}

const watchModel = (name, itemDefinition) => {
  atom.model.watch('router.url', onRouterUrlChanged.bind(null, name), {
    type: 'ensure'
  })
}

const onRouterUrlChanged = (name) => {
  const itemDefinition = _.get(atom.router, name)
  const router = _.first(atom.model.getValues('router'))
  atom.model.set(itemDefinition.destination, {
    isValid: _.isEqual(router.pathName, itemDefinition.urlPathName),
    params: _.getUrlParams(router.pathName, itemDefinition.urlPathName)
  })
}

// window listeners

const listenPopStateEvent = () => {
  window.addEventListener('popstate', () => updateModel())
}
  
const listenPushStateEvent = () => {
  window.addEventListener('click', (ev) => {
    if (isAnchorWithHref(ev)) {
      ev.stopPropagation()
      ev.preventDefault()
      replaceUrl(ev.srcElement.href)
      updateModel()
    }
  })
}

export default {
  
  init: () => {
    listenPopStateEvent()
    listenPushStateEvent()
    updateModel()
  },
  
  create: (domains) => {
    _.each(domains, (item, domain) => {
      _.each(item, (itemDefinition, name) => {
        name = domain + '.' + name
        _.consoleGroup('router', 'Created router: ' + name, 'Args:', itemDefinition)
        _.set(atom.router, name, itemDefinition)
        watchModel(name, itemDefinition)
        _.consoleGroupEnd()
      })
    })
  }
  
}
