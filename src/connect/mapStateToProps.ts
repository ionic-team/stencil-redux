import { wrapMapToPropsConstant, wrapMapToPropsFunc } from './wrapMapToProps';

export function whenMapStateToPropsIsFunction(mapStateToProps: any) {
  return (typeof mapStateToProps === 'function')
    ? wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps')
    : undefined;
}

export function whenMapStateToPropsIsMissing(mapStateToProps: any) {
  return (!mapStateToProps)
    ? wrapMapToPropsConstant(() => ({}))
    : undefined;
}

export default [
  whenMapStateToPropsIsFunction,
  whenMapStateToPropsIsMissing
];
