import Loadable from 'react-loadable'
import Pending from '$components/Pending'
import Auth from '$components/Auth'

const A = Loadable({
    loader: () => import('./A'),
    loading: Pending,
})
const B = Loadable({
    loader: () => import('./B'),
    loading: Pending,
})
const C = Loadable({
    loader: () => import('./C'),
    loading: Pending,
})


export default {
    title: '示例',
    path: '/example',
    exact: true,
    routes: [
        {
            title: 'a',
            path: 'a',
            component: Auth(A, true)
        },
        {
            title: 'b',
            path: 'b',
            component: Auth(B, true)
        },
        {
            title: 'c',
            path: 'c',
            component: Auth(C, true)
        }
    ]
}