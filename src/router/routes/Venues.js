// ** React Imports
import { lazy } from 'react'
const VenueList = lazy(() => import('../../views/pages/venue/list'))
const VenueCreate = lazy(() => import('../../views/pages/venue/create'))

const VenueRoutes = [
  {
    path: '/venues/list',
    element: <VenueList />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  },
  {
    path: '/venues/:type/:id',
    element: <VenueCreate />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  }
]

export default VenueRoutes
