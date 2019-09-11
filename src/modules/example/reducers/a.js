import { handleActions } from 'redux-actions'
import { SET_A } from '../actions/a'

export const pageA = handleActions({
  [SET_A]: (state, action) => {
    return {
      ...state,
      ...action.payload
    }
  }
}, {
    list: []
  })