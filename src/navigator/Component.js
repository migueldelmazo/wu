import { useWuGet } from '../wu'

const Navigator = () => {
  const isOnLine = useWuGet('wu.browser.navigator.onLine')

  return (
    <>
      <h2 className="title is-4">Navigator</h2>
      <pre>
        <strong>Navigator is online:</strong> {isOnLine ? 'true' : 'false'}
      </pre>
      <hr />
    </>
  )
}

export default Navigator
