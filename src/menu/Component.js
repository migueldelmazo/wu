import '.'
import { WuBackLink, WuLink } from '../wu'

const Menu = () => {
  return (
    <>
      <h2 className="title is-4">Router</h2>

      <ul>
        <li>
          <WuLink className="button is-small" href="/" type="button">
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

      <hr />
    </>
  )
}

export default Menu
