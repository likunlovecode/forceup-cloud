import React, { useState, useEffect } from 'react'
import Pending from './Pending'
import Layout from './Layout'
import Cookies from 'js-cookie'
import history from '$client/history'


export default function Auth(Com, useLayout) {

  return function (props) {
    const [auth, setAuth] = useState(false)
    useEffect(() => {
      if (auth) return

      //setTimeout(() => {
      let sid = Cookies.get('sid')
      if (sid) {
        setAuth(true)
      } else {
        history.replace('/login')
      }
      //}, 1000)

    })

    let PageLayout = useLayout ? Layout : React.Fragment

    return (
      <PageLayout >
        {
          !auth ?
            <Pending />
            :
            <Com {...props} />
        }
      </PageLayout>
    )

  }
}

