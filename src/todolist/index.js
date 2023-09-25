import { wuGet, wuReact, wuSet } from '../wu'

wuReact(() => ({ 'todo.items': [] }), ['wu.isReady'])

export const addToDoItem = wuSet(
  (items, newToDoText) => {
    items.push({ text: newToDoText, completed: false })
    return { 'todo.items': items }
  },
  ['todo.items']
)

export const toggleToDoItem = wuSet(
  (items, index) => {
    items[index].completed = !items[index].completed
    return { 'todo.items': items }
  },
  ['todo.items']
)

export const getToDoItems = wuGet(
  (items, filter) => {
    return items.filter(item => {
      if (filter === 'all') {
        return true
      } else if (filter === 'completed') {
        return item.completed
      } else if (filter === 'pending') {
        return !item.completed
      }
      return false
    })
  },
  ['todo.items']
)
