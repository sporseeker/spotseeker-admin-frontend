// Dummy data for Invitations page

export const dummyEvents = [
  {
    id: 1,
    name: "Summer Music Festival"
  },
  {
    id: 2,
    name: "Tech Conference 2025"
  },
  {
    id: 3,
    name: "Art Exhibition"
  }
]

export const dummyInvitations = [
  {
    id: 1,
    invitation_id: "INV-001",
    event: {
      id: 1,
      name: "Summer Music Festival"
    },
    user: {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com"
    },
    package: {
      id: 1,
      name: "VIP Package"
    },
    tickets_count: 2,
    status: "draft",
    featured: true,
    organization: "Music Events Inc.",
    organizer: "John Doe",
    startDateTime: "2025-07-15 18:00",
    endDateTime: "2025-07-15 23:00",
    venue: "Central Park Amphitheater"
  },
  {
    id: 2,
    invitation_id: "INV-002",
    event: {
      id: 1,
      name: "Summer Music Festival"
    },
    user: {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com"
    },
    package: {
      id: 2,
      name: "Standard Package"
    },
    tickets_count: 1,
    status: "pending",
    featured: false,
    organization: "Music Events Inc.",
    organizer: "Jane Smith",
    startDateTime: "2025-07-15 18:00",
    endDateTime: "2025-07-15 23:00",
    venue: "Central Park Amphitheater"
  },
  {
    id: 3,
    invitation_id: "INV-003",
    event: {
      id: 2,
      name: "Tech Conference 2025"
    },
    user: {
      id: 3,
      name: "Bob Johnson",
      email: "bob.johnson@example.com"
    },
    package: null,
    tickets_count: 3,
    status: "ongoing",
    featured: true,
    organization: "Tech Innovations Ltd.",
    organizer: "Bob Johnson",
    startDateTime: "2025-10-20 09:00",
    endDateTime: "2025-10-20 17:00",
    venue: "Convention Center Hall A"
  },
  {
    id: 4,
    invitation_id: "INV-004",
    event: {
      id: 3,
      name: "Art Exhibition"
    },
    user: {
      id: 4,
      name: "Alice Brown",
      email: "alice.brown@example.com"
    },
    package: {
      id: 1,
      name: "VIP Package"
    },
    tickets_count: 1,
    status: "complete",
    featured: false,
    organization: "Art Gallery Collective",
    organizer: "Alice Brown",
    startDateTime: "2025-08-10 10:00",
    endDateTime: "2025-08-10 18:00",
    venue: "Modern Art Museum"
  },
  {
    id: 5,
    invitation_id: "INV-005",
    event: {
      id: 1,
      name: "Summer Music Festival"
    },
    user: {
      id: 5,
      name: "Charlie Wilson",
      email: "charlie.wilson@example.com"
    },
    package: {
      id: 2,
      name: "Standard Package"
    },
    tickets_count: 4,
    status: "presale",
    featured: true,
    organization: "Music Events Inc.",
    organizer: "Charlie Wilson",
    startDateTime: "2025-07-15 18:00",
    endDateTime: "2025-07-15 23:00",
    venue: "Central Park Amphitheater"
  },
  {
    id: 6,
    invitation_id: "INV-006",
    event: {
      id: 2,
      name: "Tech Conference 2025"
    },
    user: {
      id: 6,
      name: "Diana Prince",
      email: "diana.prince@example.com"
    },
    package: {
      id: 1,
      name: "VIP Package"
    },
    tickets_count: 2,
    status: "soldout",
    featured: false,
    organization: "Tech Innovations Ltd.",
    organizer: "Diana Prince",
    startDateTime: "2025-10-20 09:00",
    endDateTime: "2025-10-20 17:00",
    venue: "Convention Center Hall A"
  },
  {
    id: 7,
    invitation_id: "INV-007",
    event: {
      id: 3,
      name: "Art Exhibition"
    },
    user: {
      id: 7,
      name: "Eve Garcia",
      email: "eve.garcia@example.com"
    },
    package: null,
    tickets_count: 1,
    status: "closed",
    featured: true,
    organization: "Art Gallery Collective",
    organizer: "Eve Garcia",
    startDateTime: "2025-08-10 10:00",
    endDateTime: "2025-08-10 18:00",
    venue: "Modern Art Museum"
  },
  {
    id: 8,
    invitation_id: "INV-008",
    event: {
      id: 1,
      name: "Summer Music Festival"
    },
    user: {
      id: 8,
      name: "Frank Miller",
      email: "frank.miller@example.com"
    },
    package: {
      id: 2,
      name: "Standard Package"
    },
    tickets_count: 3,
    status: "postponed",
    featured: false,
    organization: "Music Events Inc.",
    organizer: "Frank Miller",
    startDateTime: "2025-07-15 18:00",
    endDateTime: "2025-07-15 23:00",
    venue: "Central Park Amphitheater"
  },
  {
    id: 9,
    invitation_id: "INV-009",
    event: {
      id: 2,
      name: "Tech Conference 2025"
    },
    user: {
      id: 9,
      name: "Grace Lee",
      email: "grace.lee@example.com"
    },
    package: {
      id: 1,
      name: "VIP Package"
    },
    tickets_count: 1,
    status: "ongoing",
    featured: true,
    organization: "Tech Innovations Ltd.",
    organizer: "Grace Lee",
    startDateTime: "2025-10-20 09:00",
    endDateTime: "2025-10-20 17:00",
    venue: "Convention Center Hall A"
  },
  {
    id: 10,
    invitation_id: "INV-010",
    event: {
      id: 3,
      name: "Art Exhibition"
    },
    user: {
      id: 10,
      name: "Henry Davis",
      email: "henry.davis@example.com"
    },
    package: null,
    tickets_count: 2,
    status: "draft",
    featured: false,
    organization: "Art Gallery Collective",
    organizer: "Henry Davis",
    startDateTime: "2025-08-10 10:00",
    endDateTime: "2025-08-10 18:00",
    venue: "Modern Art Museum"
  },
  {
    id: 11,
    invitation_id: "INV-011",
    event: {
      id: 1,
      name: "Summer Music Festival"
    },
    user: {
      id: 11,
      name: "Ivy Chen",
      email: "ivy.chen@example.com"
    },
    package: {
      id: 2,
      name: "Standard Package"
    },
    tickets_count: 1,
    status: "complete",
    featured: true,
    organization: "Music Events Inc.",
    organizer: "Ivy Chen",
    startDateTime: "2025-07-15 18:00",
    endDateTime: "2025-07-15 23:00",
    venue: "Central Park Amphitheater"
  },
  {
    id: 12,
    invitation_id: "INV-012",
    event: {
      id: 2,
      name: "Tech Conference 2025"
    },
    user: {
      id: 12,
      name: "Jack Taylor",
      email: "jack.taylor@example.com"
    },
    package: {
      id: 1,
      name: "VIP Package"
    },
    tickets_count: 5,
    status: "presale",
    featured: false,
    organization: "Tech Innovations Ltd.",
    organizer: "Jack Taylor",
    startDateTime: "2025-10-20 09:00",
    endDateTime: "2025-10-20 17:00",
    venue: "Convention Center Hall A"
  },
  {
    id: 13,
    invitation_id: "INV-013",
    event: {
      id: 3,
      name: "Art Exhibition"
    },
    user: {
      id: 13,
      name: "Kate Rodriguez",
      email: "kate.rodriguez@example.com"
    },
    package: null,
    tickets_count: 1,
    status: "soldout",
    featured: true,
    organization: "Art Gallery Collective",
    organizer: "Kate Rodriguez",
    startDateTime: "2025-08-10 10:00",
    endDateTime: "2025-08-10 18:00",
    venue: "Modern Art Museum"
  },
  {
    id: 14,
    invitation_id: "INV-014",
    event: {
      id: 1,
      name: "Summer Music Festival"
    },
    user: {
      id: 14,
      name: "Liam Martinez",
      email: "liam.martinez@example.com"
    },
    package: {
      id: 2,
      name: "Standard Package"
    },
    tickets_count: 2,
    status: "closed",
    featured: false,
    organization: "Music Events Inc.",
    organizer: "Liam Martinez",
    startDateTime: "2025-07-15 18:00",
    endDateTime: "2025-07-15 23:00",
    venue: "Central Park Amphitheater"
  },
  {
    id: 15,
    invitation_id: "INV-015",
    event: {
      id: 2,
      name: "Tech Conference 2025"
    },
    user: {
      id: 15,
      name: "Mia Anderson",
      email: "mia.anderson@example.com"
    },
    package: {
      id: 1,
      name: "VIP Package"
    },
    tickets_count: 1,
    status: "postponed",
    featured: true,
    organization: "Tech Innovations Ltd.",
    organizer: "Mia Anderson",
    startDateTime: "2025-10-20 09:00",
    endDateTime: "2025-10-20 17:00",
    venue: "Convention Center Hall A"
  },
  {
    id: 16,
    invitation_id: "INV-016",
    event: {
      id: 3,
      name: "Art Exhibition"
    },
    user: {
      id: 16,
      name: "Noah Thompson",
      email: "noah.thompson@example.com"
    },
    package: null,
    tickets_count: 3,
    status: "draft",
    featured: false,
    organization: "Art Gallery Collective",
    organizer: "Noah Thompson",
    startDateTime: "2025-08-10 10:00",
    endDateTime: "2025-08-10 18:00",
    venue: "Modern Art Museum"
  },
  {
    id: 17,
    invitation_id: "INV-017",
    event: {
      id: 1,
      name: "Summer Music Festival"
    },
    user: {
      id: 17,
      name: "Olivia White",
      email: "olivia.white@example.com"
    },
    package: {
      id: 2,
      name: "Standard Package"
    },
    tickets_count: 1,
    status: "ongoing",
    featured: true,
    organization: "Music Events Inc.",
    organizer: "Olivia White",
    startDateTime: "2025-07-15 18:00",
    endDateTime: "2025-07-15 23:00",
    venue: "Central Park Amphitheater"
  },
  {
    id: 18,
    invitation_id: "INV-018",
    event: {
      id: 2,
      name: "Tech Conference 2025"
    },
    user: {
      id: 18,
      name: "Parker Harris",
      email: "parker.harris@example.com"
    },
    package: {
      id: 1,
      name: "VIP Package"
    },
    tickets_count: 2,
    status: "pending",
    featured: false,
    organization: "Tech Innovations Ltd.",
    organizer: "Parker Harris",
    startDateTime: "2025-10-20 09:00",
    endDateTime: "2025-10-20 17:00",
    venue: "Convention Center Hall A"
  },
  {
    id: 19,
    invitation_id: "INV-019",
    event: {
      id: 3,
      name: "Art Exhibition"
    },
    user: {
      id: 19,
      name: "Quinn Clark",
      email: "quinn.clark@example.com"
    },
    package: null,
    tickets_count: 1,
    status: "confirmed",
    featured: true,
    organization: "Art Gallery Collective",
    organizer: "Quinn Clark",
    startDateTime: "2025-08-10 10:00",
    endDateTime: "2025-08-10 18:00",
    venue: "Modern Art Museum"
  },
  {
    id: 20,
    invitation_id: "INV-020",
    event: {
      id: 1,
      name: "Summer Music Festival"
    },
    user: {
      id: 20,
      name: "Riley Lewis",
      email: "riley.lewis@example.com"
    },
    package: {
      id: 2,
      name: "Standard Package"
    },
    tickets_count: 4,
    status: "confirmed",
    featured: false,
    organization: "Music Events Inc.",
    organizer: "Riley Lewis",
    startDateTime: "2025-07-15 18:00",
    endDateTime: "2025-07-15 23:00",
    venue: "Central Park Amphitheater"
  },
  {
    id: 21,
    invitation_id: "INV-021",
    event: {
      id: 2,
      name: "Tech Conference 2025"
    },
    user: {
      id: 21,
      name: "Sophia Walker",
      email: "sophia.walker@example.com"
    },
    package: {
      id: 1,
      name: "VIP Package"
    },
    tickets_count: 1,
    status: "cancelled",
    featured: true,
    organization: "Tech Innovations Ltd.",
    organizer: "Sophia Walker",
    startDateTime: "2025-10-20 09:00",
    endDateTime: "2025-10-20 17:00",
    venue: "Convention Center Hall A"
  },
  {
    id: 22,
    invitation_id: "INV-022",
    event: {
      id: 3,
      name: "Art Exhibition"
    },
    user: {
      id: 22,
      name: "Tyler Hall",
      email: "tyler.hall@example.com"
    },
    package: null,
    tickets_count: 2,
    status: "pending",
    featured: false,
    organization: "Art Gallery Collective",
    organizer: "Tyler Hall",
    startDateTime: "2025-08-10 10:00",
    endDateTime: "2025-08-10 18:00",
    venue: "Modern Art Museum"
  },
  {
    id: 23,
    invitation_id: "INV-023",
    event: {
      id: 1,
      name: "Summer Music Festival"
    },
    user: {
      id: 23,
      name: "Uma Young",
      email: "uma.young@example.com"
    },
    package: {
      id: 2,
      name: "Standard Package"
    },
    tickets_count: 1,
    status: "confirmed",
    featured: true,
    organization: "Music Events Inc.",
    organizer: "Uma Young",
    startDateTime: "2025-07-15 18:00",
    endDateTime: "2025-07-15 23:00",
    venue: "Central Park Amphitheater"
  },
  {
    id: 24,
    invitation_id: "INV-024",
    event: {
      id: 2,
      name: "Tech Conference 2025"
    },
    user: {
      id: 24,
      name: "Victor King",
      email: "victor.king@example.com"
    },
    package: {
      id: 1,
      name: "VIP Package"
    },
    tickets_count: 3,
    status: "confirmed",
    featured: false,
    organization: "Tech Innovations Ltd.",
    organizer: "Victor King",
    startDateTime: "2025-10-20 09:00",
    endDateTime: "2025-10-20 17:00",
    venue: "Convention Center Hall A"
  }
]
