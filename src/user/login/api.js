import _ from 'lodash'

export default {

  user: {
    login: {
      method: 'get',
      path: '/data.json',
      flags: {
        sending: 'user.login.sending'
      },
      handlers: {
        code200: {
          validator: {
            'id': [_.negate(_.isEmpty), _.isString],
            'address.city': [_.negate(_.isEmpty), _.isString],
            'payments[].status': _.isString,
            'payments': [_.isArray, _.negate(_.isEmpty)]
          },
          parser: {
            'id': _.toNumber,
            'payments[].status': (value) => value === 'enabled'
          },
          mapper: {
            'id': 'userId',
            'address.city': 'addressCity',
            'payments': 'payments'
          }
        }
      }
    }
  }

}
