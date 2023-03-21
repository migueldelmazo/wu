import wu from 'wu'

const apiUserMe = {
  responseProps: 'user.api.me',
  observers: ['browser.localStorage'],
  props: { localStorage: 'getBrowserLocalStorage', error: 'user.api.me.error' },
  request: ({ localStorage }) => ({
    path: '/user/me',
    headers: { authentication: `Bearer ${localStorage.userToken}` },
    method: 'GET'
  }),
  response: ({ error }, args, { id }) => (error ? {} : { id })
}

wu(apiUserMe)
