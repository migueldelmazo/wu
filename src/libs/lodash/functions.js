import _ from 'lodash'

_.mixin({

  fnsRun: (fns, ...args) => {
    _.each(_.parseArray(fns), (fn) => fn(...args))
  }

})
