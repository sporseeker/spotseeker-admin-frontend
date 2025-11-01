// ** React Imports
import { lazy } from 'react'
const EventList = lazy(() => import('../../views/pages/events/list'))
const EventCreate = lazy(() => import('../../views/pages/events/create'))
const EventInvitations = lazy(() => import('../../views/pages/invitations/Invitations'))
const EventInvitationsSend = lazy(() => import('../../views/pages/invitations/SendInvitations'))
const NewEventRequests = lazy(() => import('../../views/pages/partners/NewEventRequests'))
const EventRequests = lazy(() => import('../../views/pages/partners/EventRequests'))

const EventsRoutes = [
  {
    path: '/events/list',
    element: <EventList />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  },
  {
    path: '/events/:type/:id',
    element: <EventCreate />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  },
  {
    path: '/events/invitations',
    element: <EventInvitations />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  },
  {
    path: '/events/send/invitations',
    element: <EventInvitationsSend />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  },
  {
    path: '/new-event-requests/new',
    element: <NewEventRequests />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  },
  {
    path: '/events/requests/list',
    element: <EventRequests />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  }
]

export default EventsRoutes
