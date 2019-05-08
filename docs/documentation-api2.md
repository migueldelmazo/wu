* **You create an API item** that watchs a path in the data model with
[`onChange`](./documentation-properties.md#onchange) and [`when`](./documentation-properties.md#when) properties.
* **When the path changes** in the data model, Wu executes the API item:
  * **Get all your [`request`](#request-property) data:** `method`, `path`, `query`, `body`, `headers` and [`context`](#optionscontext).
  * **Add the API item to a call [`queue`](#queue).**
  * When the call is ready to be sent:
    * Start the [`flags`](#optionsflags).
    * Check if the call can be returned from [`cache`](#optionscacheable) or
    * **Send the request to the server** and wait for the response.
* When the server response arrives:
  * Run the [`onResponse`](#onresponse-property) handlers:
    * Run the `onResponse.init` handler.
    * Run the custom handler: `onResponse.status200`, `onResponse.status404`, `onResponse.status500`...
    * Run the handler `onResponse.success` or `onResponse.error` (depending on the answer).
    * Run the `onResponse.complete` handler.
  * **Finish the [`flags`](#optionsflags)**.
  * **Add the call to the [`cache`](#optionscacheable)** (if applicable).
