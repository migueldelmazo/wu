import Login from '../login/Component'
import Menu from '../menu/Component'
import Shop from '../shop/Component'
import Storage from '../storage/Component'
import ToDoList from '../todolist/Component'

const App = () => {
  return (
    <div className="section">
      <h1 className="title">Wu</h1>
      <ToDoList />
      <Login />
      <Shop />
      <Menu />
      <Storage />
    </div>
  )
}

export default App
