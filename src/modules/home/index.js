import React from 'react'
import './index.less'
import history from '$client/history'


export const home = () => {
  history.replace('/user/myfile')

  return (
    <div className="home" >

    </div >
  )
}

export default home
