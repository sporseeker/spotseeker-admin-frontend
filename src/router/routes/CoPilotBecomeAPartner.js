import { lazy } from 'react'

const EventOrganizerList = lazy(() => import('../../views/pages/partnershipsAgreements/list'))

const CoPilotBecomeAPartner = [
  {
    path: '/become-a-partner/list',
    element: <EventOrganizerList />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  }
]

export default CoPilotBecomeAPartner