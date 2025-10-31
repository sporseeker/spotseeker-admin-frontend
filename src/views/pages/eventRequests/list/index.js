import {
  Card,
  CardHeader,
  CardBody,
  Col,
  Button,
  Input,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap"
import { useEffect, useMemo, useState } from "react"
import EventRequestsService from "@services/EventRequestsService"
import DataTable from "react-data-table-component"
import { useNavigate } from "react-router-dom"
import { Download, Eye, CheckCircle, XCircle, Clock, MoreVertical, Trash2 } from "react-feather"
import SpinnerComponent from "../../../../@core/components/spinner/Fallback-spinner"
import { Alert } from "@alerts"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

const EventRequestsList = () => {
  const navigate = useNavigate()
  const [eventRequests, setEventRequests] = useState([])
  const [pending, setPending] = useState(true)
  const [filterText, setFilterText] = useState("")
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(0)

  // Sample data for fallback
  const sampleData = [
    {
      id: 1,
      name: "Summer Music Festival 2025",
      name_approved: true,
      organizer: "Live Events LK",
      organizer_approved: true,
      manager: "John Silva",
      type: "concert",
      type_approved: true,
      sub_type: "Music Festival",
      sub_type_approved: true,
      start_date: "2025-12-15 18:00",
      end_date: "2025-12-15 23:00",
      date_approved: true,
      status: "pending_approval",
      featured: true,
      free_seating: false,
      banner_img_approved: true,
      thumbnail_img_approved: false,
      description_approved: true,
      venue_approved: true,
      trailer_url_approved: false,
      addons_feature: true,
      invitation_feature: false,
      invitation_count: "500",
      currency: "LKR",
      handling_cost: "100",
      handling_cost_perc: false,
      partner_id: 1,
      venue_id: "V001",
      external_event_id: "EXT001",
      uid: "UID001",
      created_at: "2025-10-30T10:30:00",
      updated_at: "2025-10-31T10:30:00",
      reviewed_at: null,
      reviewed_by: null
    },
    {
      id: 2,
      name: "Tech Conference 2025",
      name_approved: true,
      organizer: "Tech Solutions Inc",
      organizer_approved: true,
      manager: "Sarah Fernando",
      type: "conference",
      type_approved: true,
      sub_type: "Technology",
      sub_type_approved: true,
      start_date: "2025-11-20 09:00",
      end_date: "2025-11-20 17:00",
      date_approved: true,
      status: "active",
      featured: false,
      free_seating: true,
      banner_img_approved: true,
      thumbnail_img_approved: true,
      description_approved: true,
      venue_approved: true,
      trailer_url_approved: true,
      addons_feature: false,
      invitation_feature: true,
      invitation_count: "200",
      currency: "LKR",
      handling_cost: "50",
      handling_cost_perc: true,
      partner_id: 2,
      venue_id: "V002",
      external_event_id: "EXT002",
      uid: "UID002",
      created_at: "2025-10-28T08:15:00",
      updated_at: "2025-10-30T08:15:00",
      reviewed_at: "2025-10-29T10:00:00",
      reviewed_by: 1
    },
    {
      id: 3,
      name: "Cricket Championship Final",
      name_approved: false,
      organizer: "Sports Events Ltd",
      organizer_approved: true,
      manager: "Kumar Perera",
      type: "sport",
      type_approved: true,
      sub_type: "Cricket",
      sub_type_approved: false,
      start_date: "2025-12-01 14:00",
      end_date: "2025-12-01 22:00",
      date_approved: true,
      status: "active",
      featured: true,
      free_seating: false,
      banner_img_approved: false,
      thumbnail_img_approved: true,
      description_approved: true,
      venue_approved: false,
      trailer_url_approved: false,
      addons_feature: true,
      invitation_feature: true,
      invitation_count: "1000",
      currency: "LKR",
      handling_cost: "200",
      handling_cost_perc: false,
      partner_id: 3,
      venue_id: "V003",
      external_event_id: "EXT003",
      uid: "UID003",
      created_at: "2025-10-25T12:45:00",
      updated_at: "2025-10-30T12:45:00",
      reviewed_at: "2025-10-26T15:00:00",
      reviewed_by: 2
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

  const handleDelete = (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger ms-1"
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        EventRequestsService.deleteEvent(id)
          .then(() => {
            Alert("Event deleted successfully", "success")
            fetchEventRequests(currentPage, perPage)
          })
          .catch((err) => {
            Alert(err.response?.data?.message || "Failed to delete event", "error")
          })
      }
    })
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "success", icon: <CheckCircle size={14} />, text: "Active" },
      pending_approval: { color: "warning", icon: <Clock size={14} />, text: "Pending Approval" },
      draft: { color: "secondary", icon: <Clock size={14} />, text: "Draft" },
      inactive: { color: "danger", icon: <XCircle size={14} />, text: "Inactive" },
      rejected: { color: "danger", icon: <XCircle size={14} />, text: "Rejected" }
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

  const getApprovalBadge = (approved) => {
    return (
      <Badge color={approved ? "success" : "warning"}>
        {approved ? "Approved" : "Pending"}
      </Badge>
    )
  }

  const columns = [
    {
      name: "ID",
      sortable: true,
      minWidth: "80px",
      selector: (row) => row.id || 0
    },
    {
      name: "Event Name",
      sortable: true,
      minWidth: "250px",
      selector: (row) => row.name || "N/A"
    },
    {
      name: "Name Approved",
      sortable: true,
      minWidth: "150px",
      cell: (row) => getApprovalBadge(row.name_approved)
    },
    {
      name: "Organizer",
      sortable: true,
      minWidth: "200px",
      selector: (row) => row.organizer || "N/A"
    },
    {
      name: "Organizer Approved",
      sortable: true,
      minWidth: "180px",
      cell: (row) => getApprovalBadge(row.organizer_approved)
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
      name: "Type Approved",
      sortable: true,
      minWidth: "150px",
      cell: (row) => getApprovalBadge(row.type_approved)
    },
    {
      name: "Sub Type",
      sortable: true,
      minWidth: "150px",
      selector: (row) => row.sub_type || "N/A"
    },
    {
      name: "Sub Type Approved",
      sortable: true,
      minWidth: "180px",
      cell: (row) => getApprovalBadge(row.sub_type_approved)
    },
    {
      name: "Start Date",
      sortable: true,
      minWidth: "180px",
      selector: (row) => row.start_date || "N/A"
    },
    {
      name: "End Date",
      sortable: true,
      minWidth: "180px",
      selector: (row) => row.end_date || "N/A"
    },
    {
      name: "Date Approved",
      sortable: true,
      minWidth: "150px",
      cell: (row) => getApprovalBadge(row.date_approved)
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
        <Badge color={row.free_seating ? "success" : "light-secondary"}>
          {row.free_seating ? "Yes" : "No"}
        </Badge>
      )
    },
    {
      name: "Banner Approved",
      sortable: true,
      minWidth: "160px",
      cell: (row) => getApprovalBadge(row.banner_img_approved)
    },
    {
      name: "Thumbnail Approved",
      sortable: true,
      minWidth: "180px",
      cell: (row) => getApprovalBadge(row.thumbnail_img_approved)
    },
    {
      name: "Description Approved",
      sortable: true,
      minWidth: "190px",
      cell: (row) => getApprovalBadge(row.description_approved)
    },
    {
      name: "Venue Approved",
      sortable: true,
      minWidth: "160px",
      cell: (row) => getApprovalBadge(row.venue_approved)
    },
    {
      name: "Trailer Approved",
      sortable: true,
      minWidth: "160px",
      cell: (row) => getApprovalBadge(row.trailer_url_approved)
    },
    {
      name: "Addons Feature",
      sortable: true,
      minWidth: "150px",
      cell: (row) => (
        <Badge color={row.addons_feature ? "success" : "light-secondary"}>
          {row.addons_feature ? "Yes" : "No"}
        </Badge>
      )
    },
    {
      name: "Invitation Feature",
      sortable: true,
      minWidth: "170px",
      cell: (row) => (
        <Badge color={row.invitation_feature ? "success" : "light-secondary"}>
          {row.invitation_feature ? "Yes" : "No"}
        </Badge>
      )
    },
    {
      name: "Currency",
      sortable: true,
      minWidth: "120px",
      selector: (row) => row.currency || "N/A"
    },
    {
      name: "Partner ID",
      sortable: true,
      minWidth: "120px",
      selector: (row) => row.partner_id || "N/A"
    },
    {
      name: "Venue ID",
      sortable: true,
      minWidth: "120px",
      selector: (row) => row.venue_id || "N/A"
    },
    {
      name: "Created At",
      sortable: true,
      minWidth: "180px",
      selector: (row) => (row.created_at ? new Date(row.created_at).toLocaleString() : "N/A")
    },
    {
      name: "Updated At",
      sortable: true,
      minWidth: "180px",
      selector: (row) => (row.updated_at ? new Date(row.updated_at).toLocaleString() : "N/A")
    },
    {
      name: "Reviewed At",
      sortable: true,
      minWidth: "180px",
      selector: (row) => (row.reviewed_at ? new Date(row.reviewed_at).toLocaleString() : "N/A")
    },
    {
      name: "Reviewed By",
      sortable: true,
      minWidth: "130px",
      selector: (row) => row.reviewed_by || "N/A"
    },
    {
      name: "Actions",
      minWidth: "150px",
      cell: (row) => (
        <UncontrolledDropdown>
          <DropdownToggle tag="div" className="btn btn-sm">
            <MoreVertical size={14} className="cursor-pointer" />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              className="w-100"
              onClick={() => navigate(`/event-requests/view/${row.id}`)}
            >
              <Eye size={14} className="me-50" />
              <span className="align-middle">View Details</span>
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem
              className="w-100 text-danger"
              onClick={() => handleDelete(row.id)}
            >
              <Trash2 size={14} className="me-50" />
              <span className="align-middle">Delete</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      )
    }
  ]

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result
    const columnDelimiter = ","
    const lineDelimiter = "\n"

    const keys = [
      "id", "name", "name_approved", "organizer", "organizer_approved",
      "manager", "type", "type_approved", "sub_type", "sub_type_approved",
      "start_date", "end_date", "date_approved", "status", "featured",
      "free_seating", "banner_img_approved", "thumbnail_img_approved",
      "description_approved", "venue_approved", "trailer_url_approved",
      "addons_feature", "invitation_feature", "invitation_count",
      "currency", "handling_cost", "handling_cost_perc", "partner_id",
      "venue_id", "external_event_id", "uid", "analytics_ids",
      "created_at", "updated_at", "reviewed_at", "reviewed_by", "deleted_at"
    ]

    result = ""
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach((item) => {
      let ctr = 0
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter
        
        let value = item[key]
        if ((key === "created_at" || key === "updated_at" || key === "reviewed_at" || key === "deleted_at") && value) {
          value = new Date(value).toLocaleString()
        }
        if (value === null || value === undefined) {
          value = ""
        } else if (typeof value === 'boolean') {
          value = value ? "Yes" : "No"
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