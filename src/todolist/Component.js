import { useState } from 'react'
import { addToDoItem, getToDoItems, toggleToDoItem } from '.'
import { useWuGet, wuSet } from '../wu'

const ToDoList = () => {
  const [newToDo, setNewToDo] = useState('')
  const [filter, setFilter] = useState('all')
  const todoItems = useWuGet(getToDoItems, filter)

  return (
    <>
      <h2 className="title is-4">ToDo list</h2>

      <form
        onSubmit={ev => {
          ev.preventDefault()
          addToDoItem(newToDo)
          setNewToDo('')
        }}
      >
        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label">Add new ToDo:</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="text"
                  value={newToDo}
                  onChange={ev => setNewToDo(ev.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="column">
            <label>Filter by: </label>
            <div className="control">
              <label className="radio">
                <input
                  className="mr-1"
                  type="radio"
                  name="filter"
                  checked={filter === 'all'}
                  onChange={() => setFilter('all')}
                />
                All
              </label>

              <label className="radio">
                <input
                  className="ml-4 mr-1"
                  type="radio"
                  name="filter"
                  checked={filter === 'completed'}
                  onChange={() => setFilter('completed')}
                />
                Completed
              </label>

              <label className="radio">
                <input
                  className="ml-4 mr-1"
                  type="radio"
                  name="filter"
                  checked={filter === 'pending'}
                  onChange={() => setFilter('pending')}
                />
                Pending
              </label>
            </div>
          </div>
          <div className="column">
            <label className="label">Actions</label>
            <input
              className="button"
              type="button"
              value="Delete all"
              onClick={() => wuSet({ 'todo.items': [] })}
            />
          </div>
        </div>
      </form>

      <div className="content">
        <ul>
          {todoItems.map((item, index) => {
            return (
              <li key={index} className="is-clickable" onClick={() => toggleToDoItem(index)}>
                {item.text}: ({item.completed ? 'completed' : 'pending'})
              </li>
            )
          })}
        </ul>
      </div>

      <hr />
    </>
  )
}

export default ToDoList
