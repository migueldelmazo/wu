import _ from 'lodash'

// url

const isAnchorWithHref = (ev) => {
  return ev.srcElement.tagName === 'A' && _.isString(ev.srcElement.href)
}

const replaceUrl = (url) => {
  window.history.pushState({}, '', url)
}

// update atom.model.set('route...')

let atom

const updateModel = () => {
  atom.model.set('router', {
    url: window.location.href,
    pathName: window.location.pathname,
    hash: window.location.hash.substr(1),
    queryParams: _.queryParams2object(window.location.href)
  })
}

const watchModel = (atom, name, itemDefinition) => {
  atom.model.watch('router.url', onRouterUrlChanged.bind(null, atom, name), {
    type: 'ensure'
  })
}

const onRouterUrlChanged = (atom, name) => {
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
  
  init: (_atom) => {
    atom = _atom
    listenPopStateEvent()
    listenPushStateEvent()
    updateModel()
  },
  
  create: (atom, domains) => {
    _.each(domains, (item, domain) => {
      _.each(item, (itemDefinition, name) => {
        name = domain + '.' + name
        _.consoleGroup('router', 'Created router: ' + name, 'Args:', itemDefinition)
        _.set(atom.router, name, itemDefinition)
        watchModel(atom, name, itemDefinition)
        _.consoleGroupEnd()
      })
    })
  }
  
}
