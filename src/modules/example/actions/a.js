export const SET_A = 'SET_A'

export const getData = (id) => {
  return (dispatch, getState) => {
    Ajax({
      method: 'get',
      url: `/api/a/${id}`
    }).then(res => {
      console.log(res)
    })
  }
}

export const setA = data => {
  return {
    type: SET_A,
    payload: {
      ...data
    }
  }
}