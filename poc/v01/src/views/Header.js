import { useWuGet } from 'wu'

const HeaderView = () => {
  const { userName } = useWuGet('viewUserName')

  return (
    <div>
      <h3>Bienvenido {userName}</h3>
    </div>
  )
}

export default HeaderView
