// ** React Imports
import { lazy } from 'react'

const NewEventRequests = lazy(() => import('../../views/pages/copilot/NewEventRequests'))

const NewEventRequestsRoutes = [
  {
    path: '/copilot/new-event-requests',
    element: <NewEventRequests />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  }
]

export default NewEventRequestsRoutes