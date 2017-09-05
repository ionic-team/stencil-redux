import { bindActionCreators } from 'redux';
import { wrapMapToPropsConstant, wrapMapToPropsFunc } from './wrapMapToProps';

export function whenMapDispatchToPropsIsFunction(mapDispatchToProps: any) {
  return (typeof mapDispatchToProps === 'function')
    ? wrapMapToPropsFunc(mapDispatchToProps, 'mapDispatchToProps')
    : undefined;
}

export function whenMapDispatchToPropsIsMissing(mapDispatchToProps: any) {
  return (!mapDispatchToProps)
    ? wrapMapToPropsConstant((dispatch: any) => ({ dispatch }))
    : undefined;
}

export function whenMapDispatchToPropsIsObject(mapDispatchToProps: any) {
  return (mapDispatchToProps && typeof mapDispatchToProps === 'object')
    ? wrapMapToPropsConstant((dispatch: any) => bindActionCreators(mapDispatchToProps, dispatch))
    : undefined;
}

export default [
  whenMapDispatchToPropsIsFunction,
  whenMapDispatchToPropsIsMissing,
  whenMapDispatchToPropsIsObject
];
