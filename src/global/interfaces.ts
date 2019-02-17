export interface Store {
  dispatch: (action: any, _: any) => any;
  subscribe: (cb: (...args: any[]) => any) => any;
  getState: () => any;
  getStore: () => any;
  setStore: (store: any) => void;
  mapStateToProps: (component: any, props: any) => () => void;
  mapDispatchToProps: (component: any, props: any) => void;
}

export type Action = (...args: any[]) => any;
