import { wuReact, wuReactiveFetch } from '../wu/'

wuReact(() => ({ 'shop.products': [] }), ['wu.isReady'])

wuReactiveFetch(
  userToken => {
    if (userToken) {
      return {
        url: `//localhost:3000/api/shop-products.json?token=${userToken}`,
        method: 'get',
        statusPath: 'shop.productsRequest',
        onSuccess: data => ({ 'shop.products': data.products })
      }
    }
  },
  ['user.token']
)
