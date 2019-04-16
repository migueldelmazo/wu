import _ from 'lodash'

_.mixin({

  validator: (data, validators) => {
    const paths = _.getObjectPaths(data)
    return _.every(validators, (validatorFns, validatorPath) => {
      const matchedPaths = _.filter(paths, {
        pattern: validatorPath
      })
      return _.every(matchedPaths, (matchedPath) => {
        const value = _.get(data, matchedPath.path)
        return _.every(_.parseArray(validatorFns), (fn) => (fn(value)))
      })
    })
  },

  isNotEmpty: (value) => !_.isEmpty(value)

})
