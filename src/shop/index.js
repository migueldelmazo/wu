import { wuGet, wuReact, wuReactiveFetch, wuSet } from '../wu/'

// wu set

export const addProductToCart = wuSet(
  (cartProducts, productId) => {
    const cartProduct = cartProducts.find(({ id }) => id === productId)
    if (cartProduct) {
      cartProduct.units++
    } else {
      cartProducts.push({
        id: productId,
        units: 1
      })
    }
    return { 'shop.cartProducts': cartProducts }
  },
  ['shop.cartProducts']
)

// wu get

export const getCartProducts = wuGet(
  (products, cartProducts) => {
    return cartProducts.map(cartProduct => {
      const product = products.find(({ id }) => cartProduct.id === id)
      cartProduct.name = product.name
      cartProduct.price = product.price
      cartProduct.totalPrice = product.price * cartProduct.units
      return cartProduct
    })
  },
  ['shop.products', 'shop.cartProducts']
)

// wu react

wuReact(() => ({ 'shop.products': [] }), ['wu.isReady'])
wuReact(() => ({ 'shop.cartProducts': [] }), ['wu.isReady'])

wuReact(
  cartProducts => {
    const totalCartPrice = cartProducts.reduce((total, cartProduct) => {
      return total + cartProduct.totalPrice
    }, 0)
    return { 'shop.totalCartPrice': totalCartPrice }
  },
  [getCartProducts]
)

wuReact(
  cartProducts => {
    const totalCartUnits = cartProducts.reduce((total, cartProduct) => {
      return total + cartProduct.units
    }, 0)
    return { 'shop.totalCartUnits': totalCartUnits }
  },
  [getCartProducts]
)

wuReact(
  totalCartPrice => {
    const cartShippingCosts = totalCartPrice < 100 ? 10 : 0
    return { 'shop.cartShippingCosts': cartShippingCosts }
  },
  ['shop.totalCartPrice']
)

// wu fetch

wuReactiveFetch(
  userToken => {
    if (userToken) {
      return {
        url: `//localhost:3000/api/shop-products.json?token=${userToken}`,
        method: 'get',
        statusPath: 'shop.requests.products',
        onSuccess: data => ({ 'shop.products': data.products })
      }
    }
  },
  ['user.token']
)
