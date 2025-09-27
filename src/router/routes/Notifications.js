// ** React Imports
import { lazy } from 'react'
const NotificationList = lazy(() => import('../../views/pages/notifications/list'))
const NotificationCreate = lazy(() => import('../../views/pages/notifications/create'))

const NotificationRoutes = [
  {
    path: '/notification/list',
    element: <NotificationList />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  },
  {
    path: '/notification/:type/:id',
    element: <NotificationCreate />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  }
]

export default NotificationRoutes
