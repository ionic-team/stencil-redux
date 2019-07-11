import { Store as ReduxStore } from 'redux';

export class StoreService {
  private _store: ReduxStore;
  private static instance: StoreService;
  private constructor(store: ReduxStore) {
    this._store = store;
  }

  static getInstance(store?: ReduxStore) {
    // tslint:disable-next-line: strict-boolean-conditions
    if (!StoreService.instance && store) {
      StoreService.instance = new StoreService(store);
    }
    return StoreService.instance;

  }

  getStore() {
    return this._store;
  }

  getState() {
    return this._store && this._store.getState();

  }

  mapDispatchToProps = (component: any, props: any) => {
    Object.keys(props).forEach(actionName => {
      const action = props[actionName];
      Object.defineProperty(component, actionName, {
        get: () => (...args: any[]) => this._store.dispatch(action(...args)),
        configurable: true,
        enumerable: true,
      });
    });
  }

  mapStateToProps = (component: any, mapState: (...args: any[]) => any) => {
    // TODO: Don't listen for each component
    const _mapStateToProps = (_component: any, _mapState: any) => {
      const mergeProps = mapState(this._store.getState());
      Object.keys(mergeProps).forEach(newPropName => {
        const newPropValue = mergeProps[newPropName];
        component[newPropName] = newPropValue;
        // TODO: can we define new props and still have change detection work?
      });
    };

    const unsubscribe = this._store.subscribe(() => _mapStateToProps(component, mapState));

    _mapStateToProps(component, mapState);

    return unsubscribe;
  }
}
