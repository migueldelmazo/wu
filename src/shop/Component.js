import { addProductToCart, getCartProducts, setUnitsProductToCart } from '.'
import { useWuGet } from '../wu'

const Shop = () => {
  const isLoading = useWuGet('shop.requests.products.isLoading')
  const products = useWuGet('shop.products')
  const totalCartPrice = useWuGet('shop.totalCartPrice')
  const totalCartUnits = useWuGet('shop.totalCartUnits')
  const cartShippingCosts = useWuGet('shop.cartShippingCosts')
  const cartProducts = useWuGet(getCartProducts)

  return (
    <>
      <h2 className="title is-4">Shop</h2>
      <div className="columns">
        <div className="column">
          <h2 className="title is-5">Products</h2>

          {isLoading && 'Loading products...'}

          <ul>
            {products.map(product => (
              <li key={product.id}>
                {product.name}: {product.price} &euro;{' '}
                <button
                  className="button is-small is-info mb-1"
                  onClick={() => addProductToCart(product.id)}
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="column">
          <h2 className="title is-5">Cart</h2>

          {isLoading && 'Loading products...'}

          <table className="table is-bordered is-striped">
            <thead className="has-background-info">
              <tr>
                <th className="has-text-white">Name</th>
                <th className="has-text-white">Price</th>
                <th className="has-text-white">Units</th>
                <th className="has-text-white">Total price</th>
              </tr>
            </thead>
            <tbody>
              {cartProducts.map(cartProduct => (
                <tr key={cartProduct.id}>
                  <td>{cartProduct.name}</td>
                  <td>{cartProduct.price} &euro;</td>
                  <td>
                    <input
                      type="number"
                      value={cartProduct.units}
                      onChange={ev => setUnitsProductToCart(cartProduct.id, ev.target.value)}
                    />
                  </td>
                  <td>{cartProduct.totalPrice} &euro;</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="has-text-white has-background-info">
              <tr>
                <th className="has-text-white" colSpan={2}>
                  Total
                </th>
                <th className="has-text-white">{totalCartUnits}</th>
                <th className="has-text-white">{totalCartPrice} &euro;</th>
              </tr>
              <tr>
                <th className="has-text-white" colSpan={3}>
                  Shipping costs
                </th>
                <th className="has-text-white">{cartShippingCosts} &euro;</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <hr />
    </>
  )
}

export default Shop
