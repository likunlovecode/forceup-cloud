import Loadable from 'react-loadable'
import Pending from '$components/Pending'
import Auth from '$components/Auth'

const Myfile = Loadable({
    loader: () => import('./myfile'),
    loading: Pending,
})
const Recyclebin = Loadable({
  loader: () => import('./recyclebin'),
  loading: Pending,
})
const Account = Loadable({
    loader: () => import('./account'),
    loading: Pending,
  })


export default {
    title: 'user',
    path: '/user',
    exact: true,
    routes: [
        {
            title: 'myfile',
            path: 'myfile',
            component: Auth(Myfile, true)
        },
        {
            title: 'recyclebin',
            path: 'recyclebin',
            component: Auth(Recyclebin, true)
        },
        {
            title: 'account',
            path: 'account',
            component: Auth(Account, true)
        },
    ]
}