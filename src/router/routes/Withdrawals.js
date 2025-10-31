// ** React Imports
import { lazy } from 'react'
const WithdrawFunds = lazy(() => import('../../views/pages/partners/WithdrawFunds'))

const WithdrawalsRoutes = [
  {
    path: '/withdrawals/funds',
    element: <WithdrawFunds />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  }
]

export default WithdrawalsRoutes