// ** React Imports
import { lazy } from 'react'
const SalesList = lazy(() => import('../../views/pages/sales/list'))

const SalesRoutes = [
  {
    path: '/sales/list',
    element: <SalesList />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  }
]

export default SalesRoutes
