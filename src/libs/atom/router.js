import _ from 'lodash'
import { atom, getDefinition, initItem } from './common'

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

// url

const isAnchorWithHref = (ev) => {
  return ev.srcElement.tagName === 'A' && _.isString(ev.srcElement.href)
}

const replaceUrl = (url) => {
  window.history.pushState({}, '', url)
}

// update atom.model.set('route...')

const updateModel = () => {
  atom.model.set('router', {
    url: window.location.href,
    pathName: window.location.pathname,
    hash: window.location.hash.substr(1),
    queryParams: _.queryParams2object(window.location.href)
  })
}

const watchModel = (name, itemDefinition) => {
  atom.model.watch('router.url', onRouterUrlChanged.bind(null, name), { type: 'ensure' })
}

const onRouterUrlChanged = (name) => {
  const itemDefinition = getDefinition('router', name)
  const router = _.first(atom.model.getValues('router'))
  atom.model.set(itemDefinition.destination, {
    isValid: _.matchUrlParams(router.pathName, itemDefinition.urlPathName),
    params: _.getUrlParams(router.pathName, itemDefinition.urlPathName)
  })
}

export default {
  
  init: () => {
    listenPopStateEvent()
    listenPushStateEvent()
    updateModel()
  },
  
  create: (items) => {
    initItem(items, (name, definition) => {
      _.set(atom.router, name, definition)
      _.consoleGroup('router', 'Created router: ' + name, 'Args:', definition)
      watchModel(name, definition)
      _.consoleGroupEnd()
    })
  }
  
}
