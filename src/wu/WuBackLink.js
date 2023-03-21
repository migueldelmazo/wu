const WuBackLink = _props => {
  const { children, state, type, ...props } = _props

  const handleClick = ev => {
    ev.preventDefault()
    window.history.back()
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

export default WuBackLink
