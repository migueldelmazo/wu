import { wuSet } from '.'

export const setBrowserNavitagor = () => wuSet({ 'wu.browser.navigator.onLine': navigator.onLine })

window.addEventListener('online', setBrowserNavitagor)
window.addEventListener('offline', setBrowserNavitagor)
