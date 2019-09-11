import Loadable from 'react-loadable'
import Pending from '$components/Pending'
import Auth from '$components/Auth'

const FileManage = Loadable({
    loader: () => import('./filemanage/file'),
    loading: Pending,
})

const Recycle = Loadable({
  loader: () => import('./filemanage/recycle'),
  loading: Pending,
})

const Usermanage = Loadable({
  loader: () => import('./usermanage'),
  loading: Pending,
})

const RechargeRecord = Loadable({
  loader: () => import('./consumption/rechargeRecord'),
  loading: Pending,
})

const CostRecord = Loadable({
  loader: () => import('./consumption/costRecord'),
  loading: Pending,
})

const FuSet = Loadable({
  loader: () => import('./consumption/fuSet'),
  loading: Pending,
})


export default {
    title: 'admin',
    path: '/admin',
    exact: true,
    routes: [
      {
        title: 'filemanage',
        path: 'filemanage',
        routes:[
          {
            title: 'file',
            path:'/file',
            component: Auth(FileManage, true)
          },
          {
            title: 'recycle',
            path:'/recycle',
            component: Auth(Recycle, true)
          },
        ]
      },
      {
        title: 'usermanage',
        path:"/usermanage",
        component:Auth(Usermanage,true)
      },
      {
        title: 'consumption',
        path: 'consumption',
        routes:[
          {
            title: 'rechargerecord',
            path:'/rechargerecord',
            component: Auth(RechargeRecord, true)
          },
          {
            title: 'costrecord',
            path:'/costrecord',
            component: Auth(CostRecord, true)
          },
          {
            title: 'fuset',
            path:'/fuset',
            component: Auth(FuSet, true)
          },
        ]
      },
    ],
    
}