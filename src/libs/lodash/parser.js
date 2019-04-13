import _ from 'lodash'

_.mixin({

  parseCamelCaseDeep: (data) => {
    return _.mapDeep(data, _.camelCase)
  },

  parseArray: (arr) => {
    return _.isArray(arr) ? arr : [arr]
  }

})
