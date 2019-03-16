import _ from 'lodash'

_.mixin({

  cacheSetItem: (cache, key, item) => {
    cache[key] = item
  },

  cacheGetItem: (cache, key) => {
    return cache[key]
  },

  cacheDelItem: (cache, key) => {
    cache[key] = undefined
  },

  cacheExistsItem: (cache, key) => {
    return cache[key] !== undefined
  }

})
