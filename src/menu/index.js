import { wuRouter } from '../wu/'

wuRouter('/user', 'user.routes.user')
wuRouter('/user/profile', 'user.routes.profile')
wuRouter('/user/:id', 'user.routes.id')
wuRouter('/user/:id/address/:address', 'user.routes.address')
