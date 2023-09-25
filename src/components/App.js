import Login from '../login/Component'
import Menu from '../menu/Component'
import Navigator from '../navigator/Component'
import Shop from '../shop/Component'
import Storage from '../storage/Component'
import ToDoList from '../todolist/Component'

const App = () => {
  return (
    <div className="section">
      <h1 className="title">Wu</h1>
      <hr />
      <ToDoList />
      <Login />
      <Shop />
      <Menu />
      <Navigator />
      <Storage />
    </div>
  )
}

export default App
