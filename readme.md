# Stencil Redux

Work in progress library to enable Stencil + Redux apps


### Possible API

`configureStore.ts`
```javascript
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import api from '../middleware/api'
import rootReducer from '../reducers'

const configureStore = (history, preloadedState) => createStore(
  rootReducer,
  preloadedState,
  applyMiddleware(thunk, api, routerMiddleware(history))
)

export default configureStore
```

`my-app.tsx`

```javascript
import { Component, h, Prop } from '@stencil/core';

import { Store } from '@stencil/redux';

import configureStore from '../configureStore'

@Component({
  tag: 'stencil-store'
})
export class StencilStore {
  store: Store;
  
  componentWillLoad() {
    this.store = configureStore()
  }
  
  render() {
    return (
      <stencil-redux-store store={this.store}>
        <rest-of-app />
      </stencil-redux-store>
    );
  }
}
```

`my-component.tsx`
```javascript
import { Component, h, Prop } from '@stencil/core';

import { ConnectedComponent } from '@stencil/redux';

@Component({
  tag: 'stencil-store'
})
@ConnectedComponent()
export class StencilStore {
  store: Store;
  
  componentWillLoad() {
    this.store = configureStore()
  }
  
  mapStateToProps(state) {
    const {
      users: { current }
    } = state;
    
    return {
      current
    }
  }
  
  render() {
    return (
      <stencil-redux-store store={this.store}>
        <rest-of-app />
      </stencil-redux-store>
    );
  }
}
```
