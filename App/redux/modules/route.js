import { push } from 'react-router-redux'

export function pushAndDispatch (route) {
  return function (dispatch) {
    dispatch(push(route))
  }
}
