import { sendLogin } from '.'
import { useWuGet } from '../wu'

const Login = () => {
  const isLoading = useWuGet('user.loginRequest.isLoading')

  return (
    <>
      <h2 className="title is-4">Login</h2>

      <form
        onSubmit={ev => {
          ev.preventDefault()
          const formData = new FormData(ev.target)
          const formValues = Object.fromEntries(formData)
          sendLogin(formValues.email, formValues.password)
        }}
      >
        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label">Email:</label>
              <div className="control">
                <input className="input" type="text" name="email" />
              </div>
            </div>
          </div>

          <div className="column">
            <div className="field">
              <label className="label">Password:</label>
              <div className="control">
                <input className="input" type="text" name="password" />
              </div>
            </div>
          </div>

          <div className="column">
            <label className="label">Actions</label>
            <input className="button" type="submit" value="Login" disabled={isLoading} />
          </div>
        </div>
      </form>

      <hr />
    </>
  )
}

export default Login
