// ** React Imports
import { lazy } from 'react'

const Home = lazy(() => import('../../views/Home'))
const EventDashboard = lazy(() => import('../../views/EventDashboard'))

const DashboardRoutes = [
  {
    path: '/dashboard',
    element: <Home />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  },
  {
    path: '/event/dashboard',
    element: <EventDashboard />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  }
]

export default DashboardRoutes
