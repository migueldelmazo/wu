import { wuSet } from '.'

// setBrowserStorage

export const setBrowserStorage = () => {
  wuSet({
    'wu.browser.storage': {
      local: getBrowserStorage(localStorage),
      session: getBrowserStorage(sessionStorage)
    }
  })
}

window.addEventListener('storage', setBrowserStorage)

const getBrowserStorage = storage => {
  const result = {}
  for (const key in storage) {
    if (Object.hasOwnProperty.call(storage, key)) {
      result[key] = storage[key]
    }
  }
  return result
}
