// ========================================
// FILE: src/views/pages/eventRequests/list/index.js
// ========================================

import {
  Card,
  CardHeader,
  CardBody,
  Col,
  Button,
  Input,
  Badge
} from "reactstrap"
import { useEffect, useMemo, useState } from "react"
import EventRequestsService from "@services/EventRequestsService"
import DataTable from "react-data-table-component"
//import { useNavigate } from "react-router-dom"
import { Download, Eye, CheckCircle, XCircle, Clock } from "react-feather"
import SpinnerComponent from "../../../../@core/components/spinner/Fallback-spinner"
import { Alert } from "@alerts"

const EventRequestsList = () => {
  //const navigate = useNavigate()
  const [eventRequests, setEventRequests] = useState([])
  const [pending, setPending] = useState(true)
  const [filterText, setFilterText] = useState("")
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(0)

  // Sample data for testing
  const sampleData = [
    {
      id: 1,
      name: "Summer Music Festival 2025",
      organizer: "Live Events LK",
      manager: "John Silva",
      type: "concert",
      subType: "Music Festival",
      startDate: "2025-12-15 18:00",
      endDate: "2025-12-15 23:00",
      status: "pending_approval",
      featured: true,
      freeSeating: false,
      createdAt: "2025-10-30T10:30:00"
    },
    {
      id: 2,
      name: "Tech Conference 2025",
      organizer: "Tech Solutions Inc",
      manager: "Sarah Fernando",
      type: "conference",
      subType: "Technology",
      startDate: "2025-11-20 09:00",
      endDate: "2025-11-20 17:00",
      status: "active",
      featured: false,
      freeSeating: true,
      createdAt: "2025-10-28T08:15:00"
    },
    {
      id: 3,
      name: "Cricket Championship Final",
      organizer: "Sports Events Ltd",
      manager: "Kumar Perera",
      type: "sport",
      subType: "Cricket",
      startDate: "2025-12-01 14:00",
      endDate: "2025-12-01 22:00",
      status: "active",
      featured: true,
      freeSeating: false,
      createdAt: "2025-10-25T12:45:00"
    },
    {
      id: 4,
      name: "Business Workshop Series",
      organizer: "Entrepreneur Hub",
      manager: "Amaya Jayasinghe",
      type: "workshop",
      subType: "Business",
      startDate: "2025-11-10 10:00",
      endDate: "2025-11-10 16:00",
      status: "draft",
      featured: false,
      freeSeating: true,
      createdAt: "2025-10-29T15:20:00"
    },
    {
      id: 5,
      name: "Food & Wine Festival",
      organizer: "Culinary Delights",
      manager: "Ravi Mendis",
      type: "concert",
      subType: "Food Festival",
      startDate: "2025-12-20 12:00",
      endDate: "2025-12-20 20:00",
      status: "inactive",
      featured: false,
      freeSeating: true,
      createdAt: "2025-10-27T09:10:00"
    }
  ]

  const fetchEventRequests = (page = 0, limit = 10) => {
    setPending(true)
    EventRequestsService.getAllEventOrganizers(page, limit)
      .then((res) => {
        const fetchedEvents = res.data.events || []
        // Use sample data if no data fetched
        setEventRequests(fetchedEvents.length > 0 ? fetchedEvents : sampleData)
        setTotalRows(res.data.total || sampleData.length)
        setPending(false)
      })
      .catch((err) => {
        console.log(err)
        Alert(err.response?.data?.message || "Failed to fetch event requests, showing sample data", "warning")
        // Use sample data on error
        setEventRequests(sampleData)
        setTotalRows(sampleData.length)
        setPending(false)
      })
  }

  useEffect(() => {
    fetchEventRequests(currentPage, perPage)
  }, [currentPage, perPage])

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "success", icon: <CheckCircle size={14} />, text: "Active" },
      pending_approval: { color: "warning", icon: <Clock size={14} />, text: "Pending Approval" },
      draft: { color: "secondary", icon: <Clock size={14} />, text: "Draft" },
      inactive: { color: "danger", icon: <XCircle size={14} />, text: "Inactive" }
    }

    const config = statusConfig[status] || statusConfig.draft

    return (
      <Badge color={config.color} className="d-flex align-items-center gap-50">
        {config.icon}
        <span>{config.text}</span>
      </Badge>
    )
  }

  const getTypeBadge = (type) => {
    const typeColors = {
      sport: "info",
      concert: "primary",
      conference: "warning",
      workshop: "secondary"
    }
    
    return (
      <Badge color={typeColors[type] || "light"}>
        {type ? type.toUpperCase() : "N/A"}
      </Badge>
    )
  }

  const columns = [
    {
      name: "ID",
      sortable: true,
      minWidth: "80px",
      selector: (row) => row.id
    },
    {
      name: "Event Name",
      sortable: true,
      minWidth: "250px",
      selector: (row) => row.name
    },
    {
      name: "Organizer",
      sortable: true,
      minWidth: "200px",
      selector: (row) => row.organizer || "N/A"
    },
    {
      name: "Manager",
      sortable: true,
      minWidth: "180px",
      selector: (row) => row.manager || "N/A"
    },
    {
      name: "Type",
      sortable: true,
      minWidth: "120px",
      cell: (row) => getTypeBadge(row.type)
    },
    {
      name: "Sub Type",
      sortable: true,
      minWidth: "150px",
      selector: (row) => row.subType || "N/A"
    },
    {
      name: "Start Date",
      sortable: true,
      minWidth: "180px",
      selector: (row) => row.startDate || "N/A"
    },
    {
      name: "End Date",
      sortable: true,
      minWidth: "180px",
      selector: (row) => row.endDate || "N/A"
    },
    {
      name: "Status",
      sortable: true,
      minWidth: "180px",
      cell: (row) => getStatusBadge(row.status)
    },
    {
      name: "Featured",
      sortable: true,
      minWidth: "120px",
      cell: (row) => (
        <Badge color={row.featured ? "success" : "light-secondary"}>
          {row.featured ? "Yes" : "No"}
        </Badge>
      )
    },
    {
      name: "Free Seating",
      sortable: true,
      minWidth: "140px",
      cell: (row) => (
        <Badge color={row.freeSeating ? "success" : "light-secondary"}>
          {row.freeSeating ? "Yes" : "No"}
        </Badge>
      )
    },
    {
      name: "Created At",
      sortable: true,
      minWidth: "180px",
      selector: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleString() : "N/A")
    }
    /*{
      name: "View",
      minWidth: "100px",
      cell: (row) => (
        <Button
          color="primary"
          size="sm"
          //onClick={() => navigate(`/event-requests/view/${row.id}`)}
        >
          <Eye size={14} />
        </Button>
      )
    }*/
  ]

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result
    const columnDelimiter = ","
    const lineDelimiter = "\n"

    const keys = [
      "id",
      "name",
      "organizer",
      "manager",
      "type",
      "subType",
      "startDate",
      "endDate",
      "status",
      "featured",
      "freeSeating",
      "createdAt"
    ]

    result = ""
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach((item) => {
      let ctr = 0
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter
        
        let value = item[key]
        if (key === "createdAt" && value) {
          value = new Date(value).toLocaleString()
        }
        if (value === null || value === undefined) {
          value = "N/A"
        }
        
        result += value
        ctr++
      })
      result += lineDelimiter
    })

    return result
  }

  // ** Downloads CSV
  function downloadCSV(array) {
    const link = document.createElement("a")
    let csv = convertArrayOfObjectsToCSV(array)
    if (csv === null) return

    const filename = "event_requests_export.csv"

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute("href", encodeURI(csv))
    link.setAttribute("download", filename)
    link.click()
  }

  const filteredItems = eventRequests.filter((item) => {
    return JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !== -1
  })

  const handlePageChange = (page) => {
    setCurrentPage(page - 1)
  }

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage)
    setCurrentPage(page - 1)
  }

  const subHeaderComponent = useMemo(() => (
    <Col md="4">
      <Input
        id="search"
        type="text"
        placeholder="Filter table data..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
    </Col>
  ), [filterText])

  return (
    <Card>
      <CardHeader className="border-bottom">
        <h4 className="mb-0">Event Requests</h4>
        <div className="d-flex mt-md-0 mt-1">
          <Button
            className="ms-2"
            color="primary"
            onClick={() => downloadCSV(eventRequests)}
            disabled={eventRequests.length === 0}
          >
            <Download size={15} />
            <span className="align-middle ms-50">Download CSV</span>
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <div className="react-dataTable">
          <DataTable
            columns={columns}
            data={filteredItems}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationDefaultPage={currentPage + 1}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            progressPending={pending}
            progressComponent={<SpinnerComponent />}
            subHeader
            subHeaderComponent={subHeaderComponent}
          />
        </div>
      </CardBody>
    </Card>
  )
}

export default EventRequestsList