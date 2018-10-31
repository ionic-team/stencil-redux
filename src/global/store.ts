import { Store } from './interfaces';

declare var Context: any;

Context.store = (function() {
  let _store: Store;

  function setStore(store: Store) {
    _store = store;
  }

  function getState() {
    return _store && _store.getState();
  }

  function getStore() {
    return _store;
  }

  function mapDispatchToProps(component: any, props: any) {
    Object.keys(props).forEach(actionName => {
      const action = props[actionName];
      Object.defineProperty(component, actionName, {
        get: () => (...args: any[]) => action(...args)(_store.dispatch, _store.getState),
        configurable: true,
        enumerable: true
      })
    });
  }

  function mapStateToProps(component: any, mapState: Function) {
    // TODO: Don't listen for each component
    const _mapStateToProps = (_component: any, _mapState: any) => {
      const mergeProps = mapState(_store.getState());
      Object.keys(mergeProps).forEach(newPropName => {
        let newPropValue = mergeProps[newPropName];
        component[newPropName] = newPropValue;
        // TODO: can we define new props and still have change detection work?
      });
    };

    const unsubscribe = _store.subscribe(() => _mapStateToProps(component, mapState));

    _mapStateToProps(component, mapState);

    return unsubscribe;
  }

  return {
    getStore,
    setStore,
    getState,
    mapDispatchToProps,
    mapStateToProps
  } as Store;
})();
