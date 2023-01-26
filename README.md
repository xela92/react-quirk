# Quirk
_a model-friendly management library for API calls, business logic and state_

## What is Quirk?

**Quirk** is a library for managing state and business logic in your application.
It is designed to work in a React friendly way, and works with promises.

## Why Quirk?

In React, **managing API calls and business logic is a pain**. Making business logic hooks is great,
but it feels somehow unnatural to make a hook for every single API call you make and always return the same kind of data.
Often, you want to make a call, forget about mapping the data and how API works, and just have your result in a state, 
and **be able to update it with a simple setStat**e. 
This is where **Quirk** comes in.

## How does it work?

**Quirk** wants from you a simple object with:
- a `getter` function, which returns a promise
- a `setter` function, which returns a promise
- an `initialValue`, what you generally want your initial state to be
- an _optional_ `overrideInitialValue` field to override the initial state from the component

You can then define a function that returns a quirk configured with that object, to have your API logic point set (you can keep it with your models, for instance).
The getter function manages getting data, and maybe remaps it if needed; the setter function manages update, delete, and create operations.
The setter function receives a config made up from the fields you passed to the setState, the actual state, 
and the config you passed to the quirk function.

Then, you can literally do anything you need to update your APIs!

Example:

```ts
export const handleUsers = (initialValue) => 
    quirk<User[]>({
    getter: async () => (await API.getUsers()) as User[],
    setter: async (newValue, config) => {
        const { deleted, onError, state } = config
        if (!!deleted) {
            try {
                await API.deleteUser(deleted, state)
            } catch (error) {
                onError && onError(error)
                return state
            }
        }
        return (newValue || []) as User[]
    },
    overrideInitialValue: initialValue,
    initialValue: [],
})
```

## Ok, but how do I use it in React?

In your component or hook, you will just need to `useQuirkState`, passing the `quirk` function you defined and if you want some callbacks to update your error - loading states.
You will receive back: your state, a setState function, and an object with the loading, error and reload functions.
As callbacks, you can pass onSuccess and onError, which will be called when the getter or setter functions are called based on the promise result.
The great thing is: for you, it's like a normal useState, that gives you order, more powers.
You can do more, and will do even more in the future, but this is just what you need.

Example:
```ts
 const [users, setUsers, { reload, loading, error }] = useQuirkState<User[]>(
    handleUsers(),
    {
      onSuccess: (users) => console.log('onSuccess', users),
      onError: (error) => console.error('onError', error),
    },
  )
```

You can then use the `setUsers` function to update your state, even to add more to your state or even ask for data deletion (in the example, we pass a _deleted_ field to instruct the setter to call the correct API).

Update:
```ts
setUsers([...users, newUser])
```
Delete:
```ts
setUsers(users, { deleted: user })
```

## What's next?

The goal for next releases is find an equilibrium between power and simplicity, and make it even more React friendly.
I like the KISS principle: if Quirk is simple yet powerful, it can be scaled to any complexity level without becoming an overhead for developers.
