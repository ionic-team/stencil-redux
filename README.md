## Stencil Redux

A simple redux connector for Stencil-built web components inspired by [`react-redux`](https://github.com/reduxjs/react-redux).

## Install

```
npm install @stencil/redux
npm install redux
npm install -D @types/redux
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

import { Store } from '@stencil/redux';

import { Action } from '../../redux/actions';
import { RootState } from '../../redux/reducers';
import { store } from '../../redux/store';

@Component({
  tag: 'my-app',
  styleUrl: 'my-app.scss'
})
export class MyApp {
  @Prop({ context: 'store' }) store: Store<RootState, Action>;

  componentWillLoad() {
    this.store.setStore(store);
  }
}
```

### Map state and dispatch to props

:memo: *Note*: Because the mapped props are technically changed *within* the component, `mutable: true` is required for `@Prop` definitions that utilize the store. See the [Stencil docs](https://stenciljs.com/docs/properties#prop-value-mutability) for info.

```typescript
// components/my-component/my-component.tsx

import { Store, Unsubscribe } from '@stencil/redux';

import { Action, changeName } from '../../redux/actions';
import { RootState } from '../../redux/reducers';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.scss'
})
export class MyComponent {
  @Prop({ context: 'store' }) store: Store<Action, RootState>;
  @Prop({ mutable: true }) name: string;

  changeName!: typeof changeName;

  unsubscribe!: Unsubscribe;

  componentWillLoad() {
    this.unsubscribe = this.store.mapStateToProps(this, state => {
      const { user: { name } } = state;
      return { name };
    });

    this.store.mapDispatchToProps(this, { changeName });
  }

  componentDidUnload() {
    this.unsubscribe();
  }

  doNameChange(newName: string) {
    this.changeName(newName);
  }
}
```
