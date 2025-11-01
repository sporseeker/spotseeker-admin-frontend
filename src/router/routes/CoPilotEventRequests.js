import { lazy } from 'react'

const EventRequestsList = lazy(() => import('../../views/pages/eventRequests/list'))
const EventRequestsAction = lazy(() => import('../../views/pages/NewEventRequests/NewEventRequestsAction'))

const CoPilotEventRequsts = [
  {
    path: '/event-requsts/list',
    element: <EventRequestsList />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  },
  {
    path: '/event-requests/action',
    element: <EventRequestsAction />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  }
]

export default CoPilotEventRequsts