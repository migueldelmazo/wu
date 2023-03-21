import wu from 'wu'

// inicia los datos del login en el modelo
const setUserLoginInitialData = {
  observers: ['getBrowserIsReady'],
  run: () => ({ 'user.emai': '', 'user.password': '' })
}

// proporciona a la vista los datos del login desde el modelo
const viewUserLogin = {
  observers: ['user.email', 'user.password'],
  props: { email: 'user.email', password: 'user.password' },
  run: props => props
}

// guarda los cambios de la vista en el modelo
const handleUserLoginChanged = {
  run: (props, { name, value }) => ({ [name]: value })
}

// ejecuta la llamada al api del login cogiendo los datos desde el modelo y guardando la respuesta en el modelo
const apiUserLogin = {
  loadingProp: 'user.login.api.loading', // user.login.loading = true
  responseProps: 'user.login.api.response', // user.login.response = { status: 200, error: false, message: '' }
  props: { email: 'user.email', password: 'user.password', error: 'user.login.api.response.error' },
  request: ({ email, password }) => ({
    path: '/user/login',
    method: 'POST',
    body: { email, password }
  }),
  response: ({ error }, args, { token }) =>
    error ? {} : { 'browser.localStorage': { userToken: token } }
}

wu(setUserLoginInitialData, viewUserLogin, handleUserLoginChanged, apiUserLogin)
