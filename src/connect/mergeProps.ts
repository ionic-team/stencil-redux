import verifyPlainObject from '../utils/verifyPlainObject';

type KeyValueObject = {
  [key: string]: any
};

export function defaultMergeProps(stateProps: KeyValueObject, dispatchProps: KeyValueObject, ownProps: KeyValueObject) {
  return { ...ownProps, ...stateProps, ...dispatchProps };
}

export function wrapMergePropsFunc(mergeProps: Function) {
  return function initMergePropsProxy(
    dispatch, { displayName, pure, areMergedPropsEqual }
  ) {
    let hasRunOnce = false;
    let mergedProps: KeyValueObject;

    return function mergePropsProxy(stateProps: KeyValueObject, dispatchProps: KeyValueObject, ownProps: KeyValueObject) {
      const nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps);

      if (hasRunOnce) {
        if (!pure || !areMergedPropsEqual(nextMergedProps, mergedProps)) {
          mergedProps = nextMergedProps;
        }

      } else {
        hasRunOnce = true;
        mergedProps = nextMergedProps;

        if (process.env.NODE_ENV !== 'production') {
          verifyPlainObject(mergedProps, displayName, 'mergeProps');
        }
      }

      return mergedProps;
    };
  };
}

export function whenMergePropsIsFunction(mergeProps: Function) {
  return (typeof mergeProps === 'function')
    ? wrapMergePropsFunc(mergeProps)
    : undefined;
}

export function whenMergePropsIsOmitted(mergeProps: Function) {
  return (!mergeProps)
    ? () => defaultMergeProps
    : undefined;
}

export default [
  whenMergePropsIsFunction,
  whenMergePropsIsOmitted
];
