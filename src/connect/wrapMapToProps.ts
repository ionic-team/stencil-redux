import verifyPlainObject from '../utils/verifyPlainObject';

export function wrapMapToPropsConstant(getConstant: Function) {
  return function initConstantSelector(dispatch: any, options: any) {
    const constant = getConstant(dispatch, options);

    function constantSelector() { return constant; }
    (constantSelector as any).dependsOnOwnProps = false;
    return constantSelector;
  };
}

// dependsOnOwnProps is used by createMapToPropsProxy to determine whether to pass props as args
// to the mapToProps function being wrapped. It is also used by makePurePropsSelector to determine
// whether mapToProps needs to be invoked when props have changed.
//
// A length of one signals that mapToProps does not depend on props from the parent component.
// A length of zero is assumed to mean mapToProps is getting args via arguments or ...args and
// therefore not reporting its length accurately..
export function getDependsOnOwnProps(mapToProps: any) {
  return (mapToProps.dependsOnOwnProps !== null && mapToProps.dependsOnOwnProps !== undefined)
    ? Boolean(mapToProps.dependsOnOwnProps)
    : mapToProps.length !== 1;
}

// Used by whenMapStateToPropsIsFunction and whenMapDispatchToPropsIsFunction,
// this function wraps mapToProps in a proxy function which does several things:
//
//  * Detects whether the mapToProps function being called depends on props, which
//    is used by selectorFactory to decide if it should reinvoke on props changes.
//
//  * On first call, handles mapToProps if returns another function, and treats that
//    new function as the true mapToProps for subsequent calls.
//
//  * On first call, verifies the first result is a plain object, in order to warn
//    the developer that their mapToProps function is not returning a valid result.
//
export function wrapMapToPropsFunc(mapToProps: any, methodName: any) {
  return function initProxySelector(dispatch: any, { displayName }: any) {
    dispatch;
    const proxy = function mapToPropsProxy(stateOrDispatch: any, ownProps: any) {
      return (proxy as any).dependsOnOwnProps
        ? (proxy as any).mapToProps(stateOrDispatch, ownProps)
        : (proxy as any).mapToProps(stateOrDispatch);
    };

    // allow detectFactoryAndVerify to get ownProps
    (proxy as any).dependsOnOwnProps = true;

    (proxy as any).mapToProps = function detectFactoryAndVerify(stateOrDispatch: any, ownProps: any) {
      (proxy as any).mapToProps = mapToProps;
      (proxy as any).dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
      let props = proxy(stateOrDispatch, ownProps);

      if (typeof props === 'function') {
        (proxy as any).mapToProps = props;
        (proxy as any).dependsOnOwnProps = getDependsOnOwnProps(props);
        props = proxy(stateOrDispatch, ownProps);
      }

      if (process.env.NODE_ENV !== 'production') {
        verifyPlainObject(props, displayName, methodName);
      }

      return props;
    };

    return proxy;
  };
}
