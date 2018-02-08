# stencil-redux

This is a proof of concept for a new stencil-redux API. The only export of this module is a function called `createProvider`, which accepts a Redux store as its only argument and returns a provider.

```js
import store from '../store';
import { createProvider } from '@stencil/redux';
export default createProvider(store);
```

The provider can then be used to connect and disconnect components from the store:

```js
import provider from '../provider';

class MyComponent {

  componentWillLoad() {
    provider.connect(this);
  }

  componentDidUnload() {
    provider.disconnect(this);
  }
}
```

Like react-redux, you should provide a `mapStateToProps` and a `mapDispatchToProps` function. You can provide them directly to the `connect` function:

```js
componentWillLoad() {
  provider.connect(this, mapStateToProps, mapDispatchToProps);
}
```

Or you can just define them on your component:

```js
class MyComponent {

  componentWillLoad() {
    provider.connect(this);
  }

  componentDidUnload() {
    provider.disconnect(this);
  }

  mapStateToProps(state) {
    // ...
  }

  mapDispatchToProps(dispatch) {
    // ...
  }
}
```


