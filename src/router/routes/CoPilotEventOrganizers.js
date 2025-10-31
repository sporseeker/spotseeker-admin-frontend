import { lazy } from 'react'

const EventOrganizerList = lazy(() => import('../../views/pages/eventOrganizers/list'))
const EventOrganizerDetails = lazy(() => import('../../views/pages/eventOrganizers/details'))

const CoPilotEventOrganizers = [
  {
    path: '/event-organizers/list',
    element: <EventOrganizerList />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  },
  {
    path: '/event-organizers/view/:id',
    element: <EventOrganizerDetails />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  }
]

export default CoPilotEventOrganizers