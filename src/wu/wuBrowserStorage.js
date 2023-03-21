import { wuSet } from '.'

export const setBrowserStorage = () => {
  wuSet({
    'wu.browser.storage': {
      local: getStorage(localStorage),
      session: getStorage(sessionStorage)
    }
  })
}

window.addEventListener('storage', setBrowserStorage)

const getStorage = storage => {
  const result = {}
  for (const key in storage) {
    if (Object.hasOwnProperty.call(storage, key)) {
      result[key] = storage[key]
    }
  }
  return result
}
