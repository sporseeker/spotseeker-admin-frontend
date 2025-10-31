import { lazy } from 'react'

const WithdrawFunds = lazy(() => import('../../views/pages/withdrawals/list'))

const CoPilotWithdrawals = [
  {
    path: '/withdrawals/list',
    element: <WithdrawFunds />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  }
]

export default CoPilotWithdrawals