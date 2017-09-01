import { wrapMapToPropsConstant, wrapMapToPropsFunc } from './wrapMapToProps';

export function whenMapStateToPropsIsFunction(mapStateToProps: Function) {
  return (typeof mapStateToProps === 'function')
    ? wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps')
    : undefined;
}

export function whenMapStateToPropsIsMissing(mapStateToProps: Function) {
  return (!mapStateToProps)
    ? wrapMapToPropsConstant(() => ({}))
    : undefined;
}

export default [
  whenMapStateToPropsIsFunction,
  whenMapStateToPropsIsMissing
];
