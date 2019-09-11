import { handleActions } from 'redux-actions'
import { SET_COMMON } from '../actions'

export const c = handleActions({
  [SET_COMMON]: (state, action) => {
    return {
      ...state,
      ...action.payload
    }
  }
}, {
    menu: [],
    collapsed: false,
    totalSpace:'',
    fileList:[],
    recycleList:[],
  })

export default c