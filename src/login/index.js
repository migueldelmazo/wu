import { wuFetch } from '../wu'

export const sendLogin = wuFetch((email, password) => {
  return {
    url: '//localhost:3000/api/user-login.json',
    method: 'get',
    body: { email, password },
    statusPath: 'user.loginRequest',
    onSuccess: data => ({ 'user.token': data.userToken })
  }
})
