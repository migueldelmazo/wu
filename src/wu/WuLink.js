import { setBrowserLocation } from './wuBrowserRouter'

const WuLink = _props => {
  const { children, historyState, type, ...props } = _props

  const handleClick = ev => {
    ev.preventDefault()
    window.history.pushState(historyState, '', props.href)
    setBrowserLocation(historyState)
  }

  return type === 'button' ? (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  ) : (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  )
}

export default WuLink
