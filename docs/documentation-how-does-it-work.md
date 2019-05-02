# Wu framework: How does it work?

## Wu flow:

![Wu items flow](./wu-framework-items-flow.svg)

### 1º Create items:

Wu is a reactive system. Therefore **you must create items** (ensurers, watchers, routers...) that **will react after the actions of other items**.

### 2º Start Wu:

When you have created all your items **you must start Wu** using the function [`wu.start()`](./documentation-public-methods.md#wustart).
This method updates the model `app.ready = true` so that your items begin to react.

### 3º Everything reacts:

The created **items will be executed and will react** to the changes of other items.

### 4º Stable model:

Once the **model is stable and coherent, the items will stop reacting**. Wu will wait for something to happen, such as a change from the view or a response from the server. When this happens, everything will react until the model is stable again.

## Important concepts

**Your only goal** as a developer is:

1. Create a **good, logical data model** that matches your business model.
* Create elements that are **responsible for maintaining that consistent model**.

Normally applications have **large and complex flow trees** in which there are many decisions.
**With Wu those flow trees are reduced** in small individual and independent decisions.
