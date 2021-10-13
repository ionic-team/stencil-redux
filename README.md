## Stencil Redux

A simple redux connector for Stencil-built web components inspired by [`react-redux`](https://github.com/reduxjs/react-redux).

## Install

```
npm install @stencil/redux
npm install redux
```

## Usage

Stencil Redux uses the [`redux`](https://github.com/reduxjs/redux/) library underneath. Setting up the store and defining actions, reducers, selectors, etc. should be familiar to you if you've used React with Redux.

### Configure the Root Reducer

```typescript
// redux/reducers.ts

import { combineReducers } from 'redux';

// Import feature reducers and state interfaces.
import { TodoState, todos } from './todos/reducers';

// This interface represents app state by nesting feature states.
export interface RootState {
  todos: TodoState;
}

// Combine feature reducers into a single root reducer
export const rootReducer = combineReducers({
  todos,
});
```

### Configure the Actions

```typescript
// redux/actions.ts

import { RootState } from './reducers';

// Import feature action interfaces
import { TodoAction } from './todos/actions';

// Export all feature actions for easier access.
export * from './todos/actions';

// Combine feature action interfaces into a base type. Use union types to
// combine feature interfaces.
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types
export type Action = (
  TodoAction
);
```

### Configure the Store

```typescript
// redux/store.ts

import { Store, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk'; // add-on you may want
import logger from 'redux-logger'; // add-on you may want

import { RootState, rootReducer } from './reducers';

export const store: Store<RootState> = createStore(rootReducer, applyMiddleware(thunk, logger));
```

### Configure Store in Root Component

```typescript

// components/my-app/my-app.tsx
import '@stencil/redux';

import { store } from '@stencil/redux';

import { Action } from '../../redux/actions';
import { RootState } from '../../redux/reducers';
import { initialStore } from '../../redux/store';

@Component({
  tag: 'my-app',
  styleUrl: 'my-app.scss'
})
export class MyApp {

  componentWillLoad() {
    store.setStore(initialStore);
  }

}
```

### Map state and dispatch to props

:memo: *Note*: Because the mapped props are technically changed *within* the component, `mutable: true` is required for `@Prop` definitions that utilize the store. See the [Stencil docs](https://stenciljs.com/docs/properties#prop-value-mutability) for info.

```typescript
// components/my-component/my-component.tsx

import { store, Unsubscribe } from '@stencil/redux';

import { Action, changeName } from '../../redux/actions';
import { RootState } from '../../redux/reducers';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.scss'
})
export class MyComponent {
  @Prop({ mutable: true }) name: string;

  changeName!: typeof changeName;

  unsubscribe!: Unsubscribe;

  componentWillLoad() {
    this.unsubscribe = store.mapStateToProps(this, state => {
      const { user: { name } } = state;
      return { name };
    });

    store.mapDispatchToProps(this, { changeName });
  }

  componentDidUnload() {
    this.unsubscribe();
  }

  doNameChange(newName: string) {
    this.changeName(newName);
  }
}
```

### Usage with `redux-thunk`

Some Redux middleware, such as `redux-thunk`, alter the store's `dispatch()` function, resulting in type mismatches with mapped actions in your components.

To properly type mapped actions in your components (properties whose values are set by `store.mapDispatchToProps()`), you can use the following type:

```typescript
import { ThunkAction } from 'redux-thunk';

export type Unthunk<T> = T extends (...args: infer A) => ThunkAction<infer R, any, any, any>
  ? (...args: A) => R
  : T;
```

#### Example

```typescript
// redux/user/actions.ts

import { ThunkAction } from 'redux-thunk';

export const changeName = (name: string): ThunkAction<Promise<void>, RootState, void, Action> => async (dispatch, getState) => {
  await fetch(...); // some async operation
};
```

In the component below, the type of `this.changeName` is extracted from the action type to be `(name: string) => Promise<void>`.

```typescript
// components/my-component/my-component.tsx

import { changeName } from '../../redux/actions';

export class MyComponent {
  changeName!: Unthunk<typeof changeName>;

  componentWillLoad() {
    store.mapDispatchToProps(this, { changeName });
  }
}
```

#### Migration

If you were using the version 0.0.4, to migrate properly into the 0.1.0 actions must be updated. The `dispatch` is [no longer passed](https://github.com/ionic-team/stencil-redux/commit/e8b2e624a403253b2a8d1db748f7979edb7e350f) into the Action.


```diff
// components/my-component/my-component.action.ts
- import { Dispatch } from 'redux';

export enum MenuActions {
  OPEN_MENU = 'OPEN_MENU'
}

export interface OpenMenuAction {
  type: MenuActions.OPEN_MENU;
}

- export function openMenu(): Function {
-   return (dispatch: Dispatch<any>) => {
-     return dispatch({
+ export function openMenu(): OpenMenuAction {
+   return {
      type: MenuActions.CLOSE_CONFIRMATION_MENU
-     });
-   }
+ };
}

export type MenuActionsTypes = OpenMenuAction;
```
