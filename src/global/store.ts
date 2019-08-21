import { Store as ReduxStore } from 'redux';

import { Store } from './interfaces';

declare var Context: any;

export default () => {
  Context.store = ((): Store => {
    let _store: ReduxStore;

    const setStore = (store: ReduxStore) => {
      _store = store;
    };

    const getState = () => {
      return _store && _store.getState();
    };

    const getStore = () => {
      return _store;
    };

    const mapDispatchToProps = (component: any, props: any) => {
      Object.keys(props).forEach(actionName => {
        const action = props[actionName];
        Object.defineProperty(component, actionName, {
          get: () => (...args: any[]) => _store.dispatch(action(...args)),
          configurable: true,
          enumerable: true,
        });
      });
    };

    const mapStateToProps = (component: any, mapState: (...args: any[]) => any) => {
      // TODO: Don't listen for each component
      const _mapStateToProps = (_component: any, _mapState: any) => {
        const mergeProps = mapState(_store.getState());
        Object.keys(mergeProps).forEach(newPropName => {
          const newPropValue = mergeProps[newPropName];
          component[newPropName] = newPropValue;
          // TODO: can we define new props and still have change detection work?
        });
      };

      const unsubscribe = _store.subscribe(() => _mapStateToProps(component, mapState));

      _mapStateToProps(component, mapState);

      return unsubscribe;
    };

    return {
      getStore,
      setStore,
      getState,
      mapDispatchToProps,
      mapStateToProps,
    };
  })();
};
