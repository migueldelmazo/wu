import wu from 'wu'

// inicia los datos del login en el modelo
const setUserProfileInitialData = {
  observers: ['getBrowserIsReady'],
  run: () => ({ 'user.email': '', 'user.name': '' })
}

// ejecuta la llamada al profile cogiendo el user id del modelo y guardando la respuesta en el modelo
const apiUserProfile = {
  responseProps: 'user.profile.api.response', // user.profile.api.response = { status: 200, error: false, message: '' }
  observers: ['user.id'],
  props: { id: 'user.id', error: 'user.profile.api.response.error' },
  request: ({ id }) => ({ path: `/user/${id}/profile`, method: 'GET' }),
  response: ({ error }, args, { email, name }) =>
    error ? {} : { 'user.profile.email': email, 'user.profile.name': name }
}

// proporciona a la vista los datos del profile desde el modelo
const viewUserName = {
  props: { userName: 'user.profile.name' }
}

wu(setUserProfileInitialData, apiUserProfile, viewUserName)
