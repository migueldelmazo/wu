# Wu framework: console documentation

## Wu instance

In the **development environment**, the Wu value is published in the `window.wu` to facilitate development and debugging.

#### Wu's public methods are documented [here](./documentation-public-methods.md).

#### Wu's private properties are:

* `_private:`
  * `api:`
    * `cache:` Calls made through the API that have been cached by Wu.
    * `queue:` Current call list to the API and its status.
  * `items:`
    [apis](./documentation-api.md),
    [ensurers](./documentation-ensurer.md),
    [watchers](./documentation-watcher.md),
    [routers](./documentation-router.md),
    [getters](./documentation-getter.md) and
    [setters](./documentation-setter.md).
  * `model:`
    * `data:` Current data model.
    * `watchers:` List of elements that are watching some propertiesy of reactive model with its paths and validators (aka [`when`](./documentation-properties.md#when)).
  
    
Below is the result of the console of a small program that manages the user's profile and login.

![Pattern](./wu-framework-console-definitions.png)

## Wu flow

In order to improve the development experience, to facilitate debugging we have created a functionality
**that shows in the browser console the elements that are executed,**
with its variables and the elements that are reacting to other elements.

This functionality is optimized for Chrome and Firefox.

Below is the result of the console of a small program that manages the user's profile and login.

![Pattern](./wu-framework-console-trace.png)
