import { useWuGet } from '../wu'

const Storage = () => {
  const local = useWuGet('wu.browser.storage.local')
  const session = useWuGet('wu.browser.storage.session')

  return (
    <>
      <h2 className="title is-4">Storage</h2>
      <pre>
        <strong>Local storage:</strong> {JSON.stringify(local, null, 2)}
      </pre>
      <pre>
        <strong>Session storage:</strong> {JSON.stringify(session, null, 2)}
      </pre>
      <hr />
    </>
  )
}

export default Storage
