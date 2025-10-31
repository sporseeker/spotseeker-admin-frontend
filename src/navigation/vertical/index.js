import { List, PieChart, UserPlus, Users, Home, Plus, Mail, Sun, Send, DollarSign, Settings, UserCheck, FileText, User, Heart } from "react-feather"

export default [
  {
    id: "dashboard",
    title: "Pinnacle",
    icon: <Sun size={20} />,
    navLink: "/dashboard"
  },
  {
    header: ""
  },
  {
    id: "booking-list",
    title: "Current Bookings",
    icon: <List size={12} />,
    navLink: "/booking/list"
  },
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
    header: "COPILOT"
  },
  {
    id: "become-partner",
    title: "Become a Partner",
    icon: <Heart size={12} />,
    navLink: "/partners/become"
  },
  {
    id: "partnership-forms",
    title: "Partnership Forms",
    icon: <FileText size={12} />,
    navLink: "/partner-agreements/list"
  },
  {
    id: "event-organizers",
    title: "Event Organizers",
    icon: <User size={12} />,
    navLink: "/event-organizers/list"
  },
  {
    id: "new-event-requests",
    title: "New Event Requests",
    icon: <List size={12} />,
    navLink: "/event-requests/new"
  },
  {
    id: "event-requests",
    title: "Event Requests",
    icon: <List size={12} />,
    navLink: "/event-requsts/list"
  },
  {
    id: "withdraw-funds",
    title: "Withdraw Funds",
    icon: <DollarSign size={12} />,
    navLink: "/withdrawals/list"
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
    header: "Settings"
  },
  {
    id: "jobs",
    title: "Jobs",
    icon: <Settings size={12} />,
    navLink: "/jobs/queue"
  }
]