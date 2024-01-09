import { WuBackLink, WuLink, useWuGet } from '../wu'
import './index'

const Menu = () => {
  const userRoutes = useWuGet('user.routes')

  return (
    <>
      <h2 className="title is-4">Router</h2>

      <ul>
        <li>
          <WuLink className="button is-small is-info" href="/" type="button">
            WuLink Home
          </WuLink>
        </li>
        <li>
          <WuLink href="/user">WuLink User</WuLink>
        </li>
        <li>
          <WuLink href="/user/profile">WuLink User profile</WuLink>
        </li>
        <li>
          <WuLink href="/user/123">WuLink User id</WuLink>
        </li>
        <li>
          <WuLink href="/user/123/address/456" historyState={{ uno: 1 }}>
            WuLink User address
          </WuLink>
        </li>
        <li>
          <WuBackLink>WuLink Go back</WuBackLink>
        </li>
      </ul>

      <pre>user.routes: {JSON.stringify(userRoutes, null, 2)}</pre>
      <hr />
    </>
  )
}

export default Menu
