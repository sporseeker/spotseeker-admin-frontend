import { List, PieChart, UserPlus, Users, Home, Plus, Mail, Sun, Send, DollarSign, Settings } from "react-feather"

export default [
  {
    id: "dashboard",
    title: "Pinnacle",
    icon: <Sun size={20} />,
    navLink: "/dashboard"
  },
  /*{
    id: "event-dashboard",
    title: "Event Dashboard",
    icon: <Tv size={20} />,
    navLink: "/event/dashboard"
  },*/
  {
    header: ""
  },
  {
    id: "booking-list",
    title: "Current Bookings",
    icon: <List size={12} />,
    navLink: "/booking/list"
  },
  /*{
    id: "verifyBooking",
    title: "Verify Booking",
    icon: <CheckCircle size={12} />,
    navLink: "/booking/verify"
  },*/
  {
    id: "sendOrderMail",
    title: "Send Booking Conf",
    icon: <Send size={20} />,
    navLink: "/booking/sendMail"
  },
  {
    id: "generateETicket",
    title: "Create Ticket",
    icon: <Send size={20} />,
    navLink: "/booking/generateEticket"
  },
  /*{
    header: "Miscellaneous"
  },
  {
    id: "completed-booking-list",
    title: "Comp. Booking List",
    icon: <Layers size={12} />,
    navLink: "/booking/complted-list"
  },*/
  {
    header: ""
  },
  {
    id: "add-event",
    title: "Event Add",
    icon: <Plus size={12} />,
    navLink: "/events/create/new"
  },
  {
    id: "event-list",
    title: "Events",
    icon: <List size={12} />,
    navLink: "/events/list"
  },
  {
    id: "invitation-list",
    title: "Event Invitations",
    icon: <Mail size={12} />,
    navLink: "/events/invitations"
  },
  {
    header: ""
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: <Send size={12} />,
    navLink: "/notification/list"
  },
  {
    header: ""
  },
  {
    id: "create-venue",
    title: "Venue Add",
    icon: <Plus size={12} />,
    navLink: "/venues/create/new"
  },
  {
    id: "venue-list",
    title: "Venues",
    icon: <Home size={12} />,
    navLink: "/venues/list"
  },
  {
    header: ""
  },
  {
    id: "create-user",
    title: "Create User",
    icon: <UserPlus size={12} />,
    navLink: "/users/create"
  },
  {
    id: "customer-list",
    title: "Customers",
    icon: <Users size={12} />,
    navLink: "/users/list/user"
  },
  {
    id: "manager-list",
    title: "Managers",
    icon: <Users size={12} />,
    navLink: "/users/list/manager"
  },
  {
    id: "staff-list",
    title: "Staff",
    icon: <Users size={20} />,
    navLink: "/users/list/staff"
  },
  {
    header: ""
  },
  {
    id: "pgs",
    title: "Payment Methods",
    icon: <DollarSign size={12} />,
    navLink: "/payment-gateways"
  },
    {
    header: "COPILOT"
  },
  {
    id: "becomee-a-partner",
    title: "Become a Partner",
    icon: <UserPlus size={12} />,
    navLink: "/copilot/become-a-partner"
  },
  {
    id: "new-event-requests",
    title: "New Event Requests",
    icon: <Users size={12} />,
    navLink: "/copilot/new-event-requests"
  },
  {
    header: "Settings"
  },
  {
    id: "jobs",
    title: "Jobs",
    icon: <Settings size={12} />,
    navLink: "/jobs/queue"
  }
]
