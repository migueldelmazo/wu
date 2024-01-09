import { wuSet } from '.'
import { get, listen, set } from './wuState'

// set browser location on init

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
    const pathnameParts = pathname.substring(1).split('/')
    const routeParts = route.substring(1).split('/')
    const isExact = isExactRoute(pathnameParts, routeParts)
    const isValid = isValidRoute(pathnameParts, routeParts)
    const routeParams = getRouteParams(pathnameParts, routeParts)
    if (isValid) {
      set({ [destinationPath]: { isExact, isValid, routeParams } }, 'wuReact')
    } else {
      set({ [destinationPath]: { isExact: false, isValid: false, routeParams: {} } }, 'wuReact')
    }
  }
  router.wuDeps = ['wu.browser.location.pathname']
  router.wuType = 'wuRouter'
  // listen wrapper function
  listen(router)
}

// wuRouter helpers

const isExactRoute = (pathnameParts, routeParts) => {
  return isValidRoute(pathnameParts, routeParts) && pathnameParts.length === routeParts.length
}

const isValidRoute = (pathnameParts, routeParts) => {
  return routeParts.every((routePart, index) => routePart === pathnameParts[index] || routePart.startsWith(':'))
}

const getRouteParams = (pathnameParts, routeParts) => {
  return routeParts.reduce((result, routePart, index) => {
    if (routePart.startsWith(':') && pathnameParts[index]) {
      const key = routePart.substring(1)
      result[key] = pathnameParts[index]
    }
    return result
  }, {})
}
