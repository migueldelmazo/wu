1. **You create an API item** that watchs a path in the data model with
[`onChange`](./documentation-properties.md#onchange) and [`when`](./documentation-properties.md#when) properties.
1. **When the path changes** in the data model, Wu executes the API item:
    1. **Get all your [`request`](#request-property) data:** `method`, `path`, `query`, `body`, `headers` and [`context`](#optionscontext).
    1. **Add the API item to a call [`queue`](#queue).**
    1. When the call is ready to be sent:
        1. **Start the [`flags`](#optionsflags).**
        1. Check if the call **can be returned from [`cache`](#optionscacheable)** or
        1. **Send the request to the server** and wait for the response.
1. When the server response arrives:
    1. Run the [`onResponse`](#onresponse-property) handlers:
        1. Run the `onResponse.init` handler.
        1. Run the custom handler: `onResponse.status200`, `onResponse.status404`, `onResponse.status500`...
        1. Run the handler `onResponse.success` or `onResponse.error` (depending on the answer).
        1. Run the `onResponse.complete` handler.
    1. **Finish the [`flags`](#optionsflags)**.
    1. **Add the call to the [`cache`](#optionscacheable)** (if applicable).
