import { useWuApi, useWuGet } from 'wu'

const UserLoginView = () => {
  const { api, apiUserLogin } = useWuApi('apiUserLogin')
  const { email, password } = useWuGet('viewUserLogin')

  return (
    <form onSubmit={apiUserLogin}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          value={email}
          onChange={ev => wu.handleUserLoginChanged({ value: ev.target.value })}
        />
      </div>
      <div>
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={ev => wu.handleUserLoginChanged({ value: ev.target.value })}
        />
      </div>
      <div>
        <p>{api.error ? api.message : ''}</p>
        <input className={api.loading ? 'loading' : ''} type="submit" value="Iniciar sesión" />
      </div>
    </form>
  )
}

export default UserLoginView
