import { lazy } from 'react'

const EventOrganizerList = lazy(() => import('../../views/pages/partnershipsAgreements/list'))
const EventOrganizerDetails = lazy(() => import('../../views/pages/partnershipsAgreements/details'))

const CoPilotPartnershipAgreements = [
  {
    path: '/partner-agreements/list',
    element: <EventOrganizerList />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  },
  {
    path: '/partner-agreements/view/:id',
    element: <EventOrganizerDetails />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  }
]

export default CoPilotPartnershipAgreements