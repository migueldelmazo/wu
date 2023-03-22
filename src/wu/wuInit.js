import { setBrowserLocation } from './wuBrowserRouter'
import { setBrowserNavitagor } from './wuBrowserNavigator'
import { setBrowserStorage } from './wuBrowserStorage'
import { wuSet } from '.'

export const wuInit = () => {
  setBrowserLocation()
  setBrowserNavitagor()
  setBrowserStorage()
  wuSet({ 'wu.isReady': true })
}
