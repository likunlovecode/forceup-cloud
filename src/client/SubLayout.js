import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { isSet } from 'mytoolkit'

const nodePath = require('path')

const parse = (routes = [], dir = '') => {
  let parsedRoutes = []

  routes.forEach(route => {
    const path = nodePath.join(dir, route.path)
    if (isSet(route.component)) {
      parsedRoutes.push({
        path,
        title: route.title,
        component: route.component,
        exact: route.exact
      })
    }
    if (route.routes && route.routes.length > 0) {
      parsedRoutes = [
        ...parsedRoutes,
        ...parse(route.routes, path)
      ]
    }
  })

  return parsedRoutes
}

const SubLayout = ({ routes = [], dir = '' }) => {
  let parsedRoutes = parse(routes)

  return (
    <Switch>
      {
        parsedRoutes.map((route, i) => {
          return (
            <Route
              key={i}
              path={route.path}
              exact={!isSet(route.exact) && !route.exact ? false : true}
              component={route.component}
            />
          )
        })
      }
      <Route path="*" render={() => <div>404</div>} />
    </Switch>
  )
}

export default SubLayout 