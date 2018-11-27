export interface Store {
  dispatch: (action: any, _: any) => any;
  subscribe: (cb: Function) => any;
  getState: () => any;
  getStore: () => any;
  setStore: (any: any) => void;
  mapStateToProps: (component: any, props: any) => () => void;
  mapDispatchToProps: (component: any, props: any) => void;
};

export type Action = Function;
