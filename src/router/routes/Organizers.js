// ** React Imports
import { lazy } from 'react'
const EventOrganizers = lazy(() => import('../../views/pages/partners/EventOrganizers'))

const OrganizerRoutes = [
  {
    path: '/organizers/list',
    element: <EventOrganizers />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  }
]

export default OrganizerRoutes