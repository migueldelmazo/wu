import _ from 'lodash'
import '../lodash'

const common = 'border-radius: 3px; padding: 2px 0px 2px 6px;'

_.consoleConfig({
  styles: {
    api: 'background: #17a2b8; color: white;' + common,
    ensure: 'background: #dc3545; color: white;' + common,
    getter: 'background: #7cbb00; color: white;' + common,
    model: 'background: #888; color: white;' + common,
    reacting: 'border: solid 1px #000; color: black;' + common,
    react: 'background: #00a1f1; color: white;' + common,
    router: 'background: #ffc107; color: white;' + common,
    watcher: 'background: #e83e8c; color: white;' + common
  }
})
