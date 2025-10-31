import { lazy } from 'react'

const EventRequestsList = lazy(() => import('../../views/pages/eventRequests/list'))

const CoPilotEventRequsts = [
  {
    path: '/event-requsts/list',
    element: <EventRequestsList />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  }
]

export default CoPilotEventRequsts