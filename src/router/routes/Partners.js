// ** React Imports
import { lazy } from 'react'
const BecomeAPartner = lazy(() => import('../../views/pages/partners/BecomeAPartner'))
const PartnershipAgreements = lazy(() => import('../../views/pages/partners/PartnershipAgreements'))

const PartnersRoutes = [
  {
    path: '/partners/become',
    element: <BecomeAPartner />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  },
  {
    path: '/partners/agreements',
    element: <PartnershipAgreements />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  }
]

export default PartnersRoutes