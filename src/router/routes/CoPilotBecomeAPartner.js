import { lazy } from 'react'

const BecomeAPartner = lazy(() => import('../../views/pages/partners/BecomeAPartner'))

const CoPilotBecomeAPartner = [
  {
    path: '/become-a-partner/list',
    element: <BecomeAPartner />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  }
]

export default CoPilotBecomeAPartner