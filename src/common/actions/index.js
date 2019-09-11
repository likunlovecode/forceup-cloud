import { unitConversion } from '$common/utils';
import { message } from 'antd';
export const SET_COMMON = 'SET_COMMON'

export const setCommon = data => {

    return {
        type: SET_COMMON,
        payload: {
            ...data
        }
    }
}

export const getSpace = () => {
    return (dispatch, getState) => {
        Ajax({
            method: 'post',
            url: '/forceup/file/getUserStorageSpace',
          }).then((res) => {
            if (res.Code === 3) {
              dispatch(setCommon({
                totalSpace: unitConversion(res.Data)
              }))
            } else if (res.Code === 5) {
              message.error(res.Msg)
            }
          }).catch((error) => {
            console.log(error);
          })
    }
  }