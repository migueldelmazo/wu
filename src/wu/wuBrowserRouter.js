import { wuSet } from '.'
import { get, listen, set } from './wuState'

// init

export const setBrowserLocation = (historyState = {}) => {
  const validProps = ['hash', 'host', 'hostname', 'href', 'origin', 'pathname', 'port', 'protocol']
  const result = { historyState }
  for (const key in window.location) {
    if (validProps.includes(key)) {
      result[key] = window.location[key]
    }
  }
  wuSet({ 'wu.browser.location': result })
}

window.addEventListener('popstate', ev => {
  setBrowserLocation(ev.state)
})

// wuRouter

export const wuRouter = (route, destinationPath) => {
  const router = () => {
    const pathname = get('wu.browser.location.pathname')
    const isExact = isExactRoute(pathname, route)
    const isValid = isValidRoute(pathname, route)
    const routeParams = getRouteParams(pathname, route)
    set({ [destinationPath]: { isExact, isValid, routeParams } }, 'wuReact')
  }
  router.wuDeps = ['wu.browser.location.pathname']
  router.wuType = 'wuRouter'
  // listen wrapper function
  listen(router)
}

// wuRouter helpers

const isExactRoute = (pathname, route) => {
  return isValidRoute(pathname, route) && pathname.split('/').length === route.split('/').length
}

const isValidRoute = (pathname, route) => {
  const pathnameParts = pathname.substring(1).split('/')
  const routeParts = route.substring(1).split('/')
  return routeParts.every(
    (routePart, index) => routePart === pathnameParts[index] || routePart.startsWith(':')
  )
}

const getRouteParams = (pathname, route) => {
  const pathnameParts = pathname.substring(1).split('/')
  const routeParts = route.substring(1).split('/')
  return routeParts.reduce((result, routePart, index) => {
    if (routePart.startsWith(':') && pathnameParts[index]) {
      const key = routePart.substring(1)
      result[key] = pathnameParts[index]
    }
    return result
  }, {})
}
