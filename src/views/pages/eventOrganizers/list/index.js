import {
    Card,
    CardHeader,
    CardBody,
    Col,
    Button,
    Input,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Badge
  } from "reactstrap"
  import { useEffect, useMemo, useState } from "react"
  import EventOrganizerService from "@services/EventOrganizerService"
  import DataTable from "react-data-table-component"
  import { Link, useNavigate } from "react-router-dom"
  import { Download, Edit, Trash2, MoreVertical, CheckCircle, XCircle, Clock, Eye } from "react-feather"
  import SpinnerComponent from "../../../../@core/components/spinner/Fallback-spinner"
  import { Alert } from "@alerts"
  import Swal from "sweetalert2"
  import withReactContent from "sweetalert2-react-content"
  
  const MySwal = withReactContent(Swal)
  
  const EventOrganizerList = () => {
    const navigate = useNavigate()
    const [eventOrganizers, setEventOrganizers] = useState([])
    const [pending, setPending] = useState(true)
    const [filterText, setFilterText] = useState("")
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState(0)
  
    const fetchEventOrganizers = (page = 0, limit = 10) => {
      setPending(true)
      EventOrganizerService.getAllEventOrganizers(page, limit)
        .then((res) => {
          setEventOrganizers(res.data.partners || [])
          setTotalRows(res.data.total || 0)
          setPending(false)
        })
        .catch((err) => {
          console.log(err)
          Alert(err.response?.data?.message || "Failed to fetch event organizers", "error")
          setPending(false)
        })
    }
  
    useEffect(() => {
      fetchEventOrganizers(currentPage, perPage)
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
          EventOrganizerService.deleteEventOrganizer(id)
            .then(() => {
              Alert("Event organizer deleted successfully", "success")
              fetchEventOrganizers(currentPage, perPage)
            })
            .catch((err) => {
              Alert(err.response?.data?.message || "Failed to delete event organizer", "error")
            })
        }
      })
    }
  
    const handleStatusChange = (id, newStatus) => {
      MySwal.fire({
        title: `Change status to ${newStatus}?`,
        text: "This will update the event organizer's status",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ms-1"
        },
        buttonsStyling: false
      }).then((result) => {
        if (result.isConfirmed) {
          EventOrganizerService.updateEventOrganizerStatus(id, newStatus)
            .then(() => {
              Alert("Event organizer status updated successfully", "success")
              fetchEventOrganizers(currentPage, perPage)
            })
            .catch((err) => {
              Alert(err.response?.data?.message || "Failed to update status", "error")
            })
        }
      })
    }
  
    const getStatusBadge = (status) => {
      const statusConfig = {
        APPROVED: { color: "success", icon: <CheckCircle size={14} /> },
        PENDING: { color: "warning", icon: <Clock size={14} /> },
        REJECTED: { color: "danger", icon: <XCircle size={14} /> },
        SUSPENDED: { color: "secondary", icon: <XCircle size={14} /> }
      }
  
      const config = statusConfig[status] || statusConfig.PENDING
  
      return (
        <Badge color={config.color} className="d-flex align-items-center gap-50">
          {config.icon}
          <span>{status}</span>
        </Badge>
      )
    }
  
    const getUserTypeBadge = (userType) => {
      return (
        <Badge color={userType === "ADMIN" ? "primary" : "info"}>
          {userType}
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
        name: "Email",
        sortable: true,
        minWidth: "250px",
        selector: (row) => row.email
      },
      {
        name: "Mobile",
        sortable: true,
        minWidth: "150px",
        selector: (row) => row.mobile
      },
      {
        name: "User Type",
        sortable: true,
        minWidth: "120px",
        cell: (row) => getUserTypeBadge(row.userType)
      },
      {
        name: "Status",
        sortable: true,
        minWidth: "150px",
        cell: (row) => getStatusBadge(row.status)
      },
      {
        name: "Profile",
        sortable: true,
        minWidth: "120px",
        cell: (row) => (
          <Badge color={row.profileComplete ? "success" : "warning"}>
            {row.profileComplete ? "Complete" : "Incomplete"}
          </Badge>
        )
      },
      {
        name: "Mobile Verified",
        sortable: true,
        minWidth: "150px",
        cell: (row) => (
          <Badge color={row.mobileVerified ? "success" : "danger"}>
            {row.mobileVerified ? "Verified" : "Not Verified"}
          </Badge>
        )
      },
      {
        name: "Created At",
        sortable: true,
        minWidth: "180px",
        selector: (row) => new Date(row.createdAt).toLocaleString()
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
                onClick={() => navigate(`/event-organizers/view/${row.id}`)}
              >
                <Eye size={14} className="me-50" />
                <span className="align-middle">View Details</span>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem header>Change Status</DropdownItem>
              <DropdownItem
                className="w-100"
                onClick={() => handleStatusChange(row.id, "APPROVED")}
                disabled={row.status === "APPROVED"}
              >
                <CheckCircle size={14} className="me-50" />
                <span className="align-middle">Approve</span>
              </DropdownItem>
              <DropdownItem
                className="w-100"
                onClick={() => handleStatusChange(row.id, "REJECTED")}
                disabled={row.status === "REJECTED"}
              >
                <XCircle size={14} className="me-50" />
                <span className="align-middle">Reject</span>
              </DropdownItem>
              <DropdownItem
                className="w-100"
                onClick={() => handleStatusChange(row.id, "SUSPENDED")}
                disabled={row.status === "SUSPENDED"}
              >
                <XCircle size={14} className="me-50" />
                <span className="align-middle">Suspend</span>
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
  
      const keys = ["id", "email", "mobile", "userType", "status", "profileComplete", "mobileVerified", "createdAt"]
  
      result = ""
      result += keys.join(columnDelimiter)
      result += lineDelimiter
  
      array.forEach((item) => {
        let ctr = 0
        keys.forEach((key) => {
          if (ctr > 0) result += columnDelimiter
          result += item[key] || ""
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
  
      const filename = "event_organizers_export.csv"
  
      if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`
      }
  
      link.setAttribute("href", encodeURI(csv))
      link.setAttribute("download", filename)
      link.click()
    }
  
    const filteredItems = eventOrganizers.filter(
      (item) => JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !== -1)
  
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
          <h4 className="mb-0">Event Organizers</h4>
          <div className="d-flex mt-md-0 mt-1">
            <Button
              className="ms-2"
              color="primary"
              onClick={() => downloadCSV(eventOrganizers)}
              disabled={eventOrganizers.length === 0}
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
  
  export default EventOrganizerList