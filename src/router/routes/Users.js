// ** React Imports
import { lazy } from 'react'
const UsersList = lazy(() => import('../../views/pages/users/list'))
const CreateUser = lazy(() => import('../../views/pages/users/create'))

const UserRoutes = [
  {
    path: '/users/list/:type',
    element: <UsersList />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  },
  {
    path: '/users/create',
    element: <CreateUser />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  }
]

export default UserRoutes
