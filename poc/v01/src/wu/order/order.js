// PEDIDOS

// ejecuta la llamada a orders cuando el userId cambia y guarda los pedidos en el modelo
export const apiOrders = {
  loadingProp: 'orders.list.api.loading',
  responseProps: 'orders.list.api.response',
  observers: ['user.id'],
  props: { userId: 'getUserId', error: 'orders.list.api.response.error' },
  request: ({ userId }) => ({ path: `/user/${userId}/orders`, method: 'GET' }),
  request: ({ userId }) => {
    if (!userId) {
      return {
        path: '/user/90/orders',
        method: 'GET'
      }
    } else {
      return null
    }
  },
  response: ({ error }, args, response) => (error ? {} : { 'orders.list': response })
}

// proporciona a la vista los datos de los pedidos desde el modelo
export const viewOrders = {
  observers: ['orders.list', 'orders.list.api.loading', 'orders.list.api.response'],
  props: {
    items: 'orders.list',
    loading: 'orders.list.api.loading',
    error: 'orders.list.api.response.error'
  }
}
