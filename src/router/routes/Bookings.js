// ** React Imports
import { lazy } from 'react'
import ETicketGenerate from '../../views/pages/bookings/ETicketGenerate'
const BookingVerify = lazy(() => import('../../views/pages/bookings/verify'))
const SendBookingMail = lazy(() => import('../../views/pages/bookings/sendOrderMail'))
const BookingList = lazy(() => import('../../views/pages/bookings/list/index'))
const CompletedBookingList = lazy(() => import('../../views/pages/bookings/completedList/index'))

const BookingRoutes = [
  {
    path: '/booking/verify',
    element: <BookingVerify />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  },
  {
    path: '/booking/sendMail',
    element: <SendBookingMail />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  },
  {
    path: '/booking/list',
    element: <BookingList />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  },
  {
    path: '/booking/complted-list',
    element: <CompletedBookingList />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  },
  {
    path: '/booking/generateEticket',
    element: <ETicketGenerate />,
    meta: {
      publicRoute: false,
      restricted: false
    }
  }
]

export default BookingRoutes
