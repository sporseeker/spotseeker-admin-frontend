// ** React Imports

import NewEventRequests from '../../views/pages/NewEventRequests/NewEventRequestsAction'
import NewEventRequestsTable from '../../views/pages/NewEventRequests/NewEventRequestsTable'


const NewEventRequestsRoutes = [
  {
    path: '/new-event-requests',
    element:<NewEventRequestsTable/>,
    meta: {
      publicRoute: false,
      restricted: false
    }
  },
  {
    path: '/new-event-requests/action',
    element: <NewEventRequests/>,
    meta: {
      publicRoute: false,
      restricted: false
    }
  }

]

export default NewEventRequestsRoutes