import wu, { setInitialData } from 'wu'

// VALORES INICIALES

const getLocalStorage = () => {
  const keys = Object.keys(localStorage)
  return keys.reduce((result, key) => {
    result.key = JSON.parse(localStorage.getItem(key))
    return result
  }, {})
}

setInitialData({
  browser: {
    route: {
      path: location.pathname,
      host: location.host,
      hash: location.hash,
      protocol: location.protocol,
      port: location.port,
      search: location.search
    },
    localStorage: getLocalStorage(),
    isReady: true
  }
})

// IS READY

const getBrowserIsReady = {
  props: { isReady: 'browser.isReady' }
}

// LOCAL STORAGE

const getBrowserLocalStorage = {
  props: { localStorage: 'browser.localStorage' }
}

const setBrowserLocalStorage = {
  run: (props, { name, value }) => {
    localStorage.setItem(name, JSON.stringify(value))
    return { [`browser.localStorage.${name}`]: value }
  }
}

wu(getBrowserIsReady, getBrowserLocalStorage, setBrowserLocalStorage)
