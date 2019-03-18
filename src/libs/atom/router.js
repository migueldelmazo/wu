import _ from 'lodash'
import { atom, getDefinition, initDefinition } from './common'

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

const watchModel = (name) => {
  atom.model.watch('router.url', onRouterUrlChanged.bind(null, name), {
    type: 'ensure'
  })
}

const onRouterUrlChanged = (name) => {
  const definition = getDefinition('router', name)
  const router = _.first(atom.model.getValues('router'))
  const isValid = _.matchUrlParams(router.pathName, definition.urlPathName)
  setItemModel(definition, router, isValid)
  runFn(definition, isValid)
}

const setItemModel = (definition, router, isValid) => {
  const params = isValid
    ? _.getUrlParams(router.pathName, definition.urlPathName)
    : {}
  atom.model.set(definition.destination, { isValid, params })
}

const runFn = (definition, isValid) => {
  if (isValid && _.isFunction(definition.fn)) {
    _.fnRun(definition.fn)
  }
}

export default {

  init: () => {
    listenPopStateEvent()
    listenPushStateEvent()
    updateModel()
  },

  create: (items) => {
    initDefinition(items, (name, definition) => {
      _.set(atom.router, name, definition)
      _.consoleGroup('router', 'Created router: ' + name, 'Args:', definition)
      watchModel(name)
      _.consoleGroupEnd()
    })
  }

}
