import { useWuGet } from '../wu'

const Storage = () => {
  const local = useWuGet('wu.browser.storage.local')
  const session = useWuGet('wu.browser.storage.session')

  return (
    <>
      <h2 className="title is-4">Storage</h2>
      <p>
        <strong>Local storage:</strong> {JSON.stringify(local)}
      </p>
      <p>
        <strong>Session storage:</strong> {JSON.stringify(session)}
      </p>
      <hr />
    </>
  )
}

export default Storage
