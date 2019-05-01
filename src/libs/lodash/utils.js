import _ from 'lodash'

_.mixin({

  includesString: (str, searchString) => {
    str = _.lowerCase(_.deburr(str))
    searchString = _.lowerCase(_.deburr(searchString))
    return _.includes(str, searchString)
  },

  updateCollectionItem: (items, idName, newItem) => {
    const itemIdx = _.findIndex(items, (item) => {
      return item[idName] === newItem[idName]
    })
    if (itemIdx >= 0) {
      _.extend(items[itemIdx], newItem)
    }
  }

})
