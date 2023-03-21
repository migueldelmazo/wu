import { useWuSet } from 'wu'

useWuSet(
  email => {
    return { 'login.validation.email': isValidEmail(email) }
  },
  ['login.email']
)

useWuRouter(
  (userId, routerPath) => {
    if (routePath === 'login' && userId) {
      return { path: 'home' }
    }
  },
  ['user.id', 'router.path']
)

useWuLocalStorage('user.id', '')

useWuEvent((email, password) => {
  return {
    'login.email': email,
    'login.password': password
  }
})

useWuFetch(
  (email, password) => {
    if (!isValidEmail(email) || !isValidPassword(password)) {
      return
    }
    return [
      {
        url: 'http://localhost:3000/api/login',
        method: 'post',
        body: { email, password },
        loading: 'login.loading',
        status: 'login.status',
        onSuccess: response => {
          return { 'user.id': response.userId }
        },
        onError: response => {
          return { 'login.error': response.error }
        }
      },
      {
        url: 'http://localhost:3000/stats/event',
        method: 'post',
        body: { event: 'login' }
      }
    ]
  },
  ['login.email', 'login.password']
)

const email = useWuGet('login.email')

const isValidEmail = email => {}
