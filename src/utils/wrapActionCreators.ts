import { bindActionCreators, ActionCreator } from 'redux';

export default function wrapActionCreators(actionCreators) {
  return dispatch => bindActionCreators(actionCreators, dispatch);
}
