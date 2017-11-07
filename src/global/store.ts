import { Store } from './interfaces';

declare var Context: any;

Context.store = (function() {
  let _store;

  function setStore(store) {
    _store = store;
  }

  function getState() {
    return _store && _store.getState();
  }

  function getStore() {
    return _store;
  }

  function mapDispatchToProps(component, props) {
    Object.keys(props).forEach(actionName => {
      const action = props[actionName];
      Object.defineProperty(component, actionName, {
        get: () => (...args) => action(...args)(_store.dispatch, _store.getState),
        configurable: true,
        enumerable: true
      })
    });
  }

  function mapStateToProps(component, mapState) {
    // TODO: Don't listen for each component
    const _mapStateToProps = (_component, _mapState) => {
      const mergeProps = mapState(_store.getState());
      Object.keys(mergeProps).forEach(newPropName => {
        let newPropValue = mergeProps[newPropName];
        component[newPropName] = newPropValue;
        // TODO: can we define new props and still have change detection work?
      });
    };

    _store.subscribe(() => _mapStateToProps(component, mapState));

    _mapStateToProps(component, mapState);
  }

  return {
    getStore,
    setStore,
    getState,
    mapDispatchToProps,
    mapStateToProps
  } as Store;
})();
