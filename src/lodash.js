import _ from 'lodash'
import 'lodash-utils/pkg/console'
import 'lodash-utils/pkg/error'
import 'lodash-utils/pkg/iterators'
import 'lodash-utils/pkg/log'
import 'lodash-utils/pkg/parser'
import 'lodash-utils/pkg/url'
import 'lodash-utils/pkg/validator'

const common = 'border-radius: 3px; padding: 2px 6px;'

_.consoleConfig({
  styles: {
    api: 'background: #17a2b8; color: white;' + common,
    ensurer: 'background: #dc3545; color: white;' + common,
    getter: 'background: #7cbb00; color: white;' + common,
    model: 'background: #888; color: white;' + common,
    reacting: 'border: solid 1px #666; color: #666;' + common,
    react: 'background: #00a1f1; color: white;' + common,
    router: 'background: #ffc107; color: white;' + common,
    setter: 'background: #34ab53; color: white;' + common,
    watcher: 'background: #e83e8c; color: white;' + common,
    wu: 'background: #000; color: white;' + common
  }
})

_.logConfig({
  console: {
    show: process.env.NODE_ENV === 'development'
  }
})

_.listenWindowError()
