1. **You create an API item** that watchs a path in the data model with
[`onChange`](./documentation-properties.md#onchange) and [`when`](./documentation-properties.md#when) properties.
1. **When the path changes** in the data model, Wu executes the API item:
    - **Get all your [`request`](#request-property) data:** `method`, `path`, `query`, `body`, `headers` and [`context`](#optionscontext).
    - **Add the API item to a call [`queue`](#queue).**
    - When the call is ready to be sent:
        1. **Start the [`flags`](#optionsflags).**
        1. Check if the call **can be returned from [`cache`](#optionscacheable)** or
        1. **Send the request to the server** and wait for the response.
