import { Action, AnyAction, Store as ReduxStore, Unsubscribe } from 'redux';

export interface Store<S = any, A extends Action = AnyAction> {
  getState: () => S;
  getStore: () => ReduxStore<S, A>;
  setStore: (store: ReduxStore<S, A>) => void;
  mapStateToProps: <C extends R, R>(component: C, mapper: (state: S) => R) => Unsubscribe;
  mapDispatchToProps: <C extends { [K in keyof P]: any }, P>(component: C, props: P) => void;
}

/**
 * @deprecated See README.md for new usage.
 */
export type Action = (...args: any[]) => any;

export { Unsubscribe };
