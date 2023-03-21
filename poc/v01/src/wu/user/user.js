import wu from 'wu'

// expone el id del usuario desde el modelo
const getUserId = {
  props: { userId: 'user.id' }
}

wu(getUserId)
