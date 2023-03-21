import '.'
import { useWuGet } from '../wu'

const Shop = () => {
  const isLoading = useWuGet('shop.productsRequest.isLoading')
  const products = useWuGet('shop.products')

  return (
    <>
      <h2 className="title is-4">Shop</h2>

      {isLoading && 'Loading products...'}

      {products.map(product => (
        <li key={product.id}>
          {product.name}: {product.price} &euro;
        </li>
      ))}

      <hr />
    </>
  )
}

export default Shop
