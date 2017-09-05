import verifySubselectors from './verifySubselectors';

type KeyValueObject = {
  [key: string]: any
};

export function impureFinalPropsSelectorFactory(
  mapStateToProps: Function,
  mapDispatchToProps: Function,
  mergeProps: Function,
  dispatch: any
) {
  return function impureFinalPropsSelector(state: any, ownProps: any) {
    return mergeProps(
      mapStateToProps(state, ownProps),
      mapDispatchToProps(dispatch, ownProps),
      ownProps
    );
  };
}

export function pureFinalPropsSelectorFactory(
  mapStateToProps: any,
  mapDispatchToProps: any,
  mergeProps: any,
  dispatch: any,
  { areStatesEqual, areOwnPropsEqual, areStatePropsEqual }: KeyValueObject
) {
  let hasRunAtLeastOnce = false;
  let state: KeyValueObject;
  let ownProps: KeyValueObject;
  let stateProps: KeyValueObject;
  let dispatchProps: KeyValueObject;
  let mergedProps: KeyValueObject;

  function handleFirstCall(firstState: any, firstOwnProps: any) {
    state = firstState;
    ownProps = firstOwnProps;
    stateProps = mapStateToProps(state, ownProps);
    dispatchProps = mapDispatchToProps(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    hasRunAtLeastOnce = true;
    return mergedProps;
  }

  function handleNewPropsAndNewState() {
    stateProps = mapStateToProps(state, ownProps);

    if (mapDispatchToProps.dependsOnOwnProps) {
      dispatchProps = mapDispatchToProps(dispatch, ownProps);
    }

    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleNewProps() {
    if (mapStateToProps.dependsOnOwnProps) {
      stateProps = mapStateToProps(state, ownProps);
    }

    if (mapDispatchToProps.dependsOnOwnProps) {
      dispatchProps = mapDispatchToProps(dispatch, ownProps);
    }

    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleNewState() {
    const nextStateProps = mapStateToProps(state, ownProps);
    const statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
    stateProps = nextStateProps;

    if (statePropsChanged) {
      mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    }

    return mergedProps;
  }

  function handleSubsequentCalls(nextState: KeyValueObject, nextOwnProps: KeyValueObject) {
    const propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
    const stateChanged = !areStatesEqual(nextState, state);
    state = nextState;
    ownProps = nextOwnProps;

    if (propsChanged && stateChanged) { return handleNewPropsAndNewState(); }
    if (propsChanged) { return handleNewProps(); }
    if (stateChanged) { return handleNewState(); }
    return mergedProps;
  }

  return function pureFinalPropsSelector(nextState: KeyValueObject, nextOwnProps: KeyValueObject) {
    return hasRunAtLeastOnce
      ? handleSubsequentCalls(nextState, nextOwnProps)
      : handleFirstCall(nextState, nextOwnProps);
  };
}

// TODO: Add more comments

// If pure is true, the selector returned by selectorFactory will memoize its results,
// allowing connectAdvanced's shouldComponentUpdate to return false if final
// props have not changed. If false, the selector will always return a new
// object and shouldComponentUpdate will always return true.

export default function finalPropsSelectorFactory(dispatch: any, {
  initMapStateToProps,
  initMapDispatchToProps,
  initMergeProps,
  ...options
}: KeyValueObject) {
  const mapStateToProps = initMapStateToProps(dispatch, options);
  const mapDispatchToProps = initMapDispatchToProps(dispatch, options);
  const mergeProps = initMergeProps(dispatch, options);

  if (process.env.NODE_ENV !== 'production') {
    verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps, options.displayName);
  }

  const selectorFactory = options.pure
    ? pureFinalPropsSelectorFactory
    : impureFinalPropsSelectorFactory;

  return selectorFactory(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    dispatch,
    options
  );
}
