// ** React Imports
import { lazy } from 'react'
const JobsQueue = lazy(() => import('../../views/pages/settings/JobsQueue'))
const PaymentGateways = lazy(() => import('../../views/pages/settings/paymentGateways'))
const PaymentGatewayEdit = lazy(() => import('../../views/pages/settings/paymentGateways/edit'))

const SettingsRoutes = [
  {
    path: '/jobs/queue',
    element: <JobsQueue />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  },
  {
    path: '/payment-gateways',
    element: <PaymentGateways />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  },
  {
    path: '/payment-gateways/edit/:id',
    element: <PaymentGatewayEdit />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  }
]

export default SettingsRoutes
