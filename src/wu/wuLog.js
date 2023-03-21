import _ from 'lodash'

// error

export const logError = (title, ...args) => {
  console.groupCollapsed(`%cWu error: ${title}`, getBgStyles('EA4335'), ...args)
  console.trace()
  console.groupEnd()
}

// fetch

export const logFetchStart = (title, request) => {
  console.group(
    `%c${title}%c ${request.request.method}:${request.request.url}`,
    getBgStyles('4285F4'),
    getFontStyles()
  )
  console.groupCollapsed(`%cFetch info`, getBgStyles('4285F4'))
  console.log(_.cloneDeep(request))
  console.groupEnd()
}

export const logFetchEnd = () => {
  console.groupEnd()
}

export const logFetchRequests = requests => {
  console.log('%cFinal fetch requests:', getBgStyles('4285F4'), _.cloneDeep(requests))
}

// reactions

export const logReactionStart = changedPath => {
  console.group(`%cReacting to...%c ${changedPath}`, getBgStyles('7CBB00'), getFontStyles())
}

export const logReactionEnd = () => {
  console.groupEnd()
}

export const logReactionsEnd = state => {
  console.log('%cFinal state:', getBgStyles('4285F4'), _.cloneDeep(state))
}

// set

export const logSet = (logMethod, subState, newState, changes) => {
  console.groupCollapsed(
    `%c${logMethod}%c ${valueToString(subState)}`,
    getBgStyles('00A1F1'),
    getBgStyles('FFF')
  )
  console.log('Sub state:', _.cloneDeep(subState))
  console.log('Final state:', _.cloneDeep(newState))
  console.log('Pending reactions:', _.cloneDeep(changes))
  console.groupCollapsed('%cCall stack', getBgStyles('FFF'))
  console.trace()
  console.groupEnd()
  console.groupEnd()
}

// helpers

const getBgStyles = (bgColor = 'EA4335') => {
  return bgColor === 'FFF'
    ? `font-weight: normal`
    : `background: #${bgColor}; color: white; padding: 2px 5px 1px 5px; font-weight: bold`
}

const getFontStyles = (fontWeight = 'normal') => {
  return `font-weight: ${fontWeight}`
}

const valueToString = subState => {
  const maxLength = 50
  const description = JSON.stringify(subState)
  return description.length > maxLength ? description.substring(0, maxLength) + '...}' : description
}
