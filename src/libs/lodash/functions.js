import _ from 'lodash'

_.mixin({

  fnRun: (fn, ...args) => {
    return fn(...args)
  },

  fnsRun: (fns, ...args) => {
    _.each(_.parseArray(fns), (fn) => fn(...args))
  }

})
