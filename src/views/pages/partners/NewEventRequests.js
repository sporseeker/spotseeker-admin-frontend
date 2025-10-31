import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Button,
  Input,
  Col,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from 'reactstrap'
import { Download, MoreVertical, Edit, Trash2 } from 'react-feather'
import CustomDataTable from "@components/data-table"
import SpinnerComponent from '../../../@core/components/spinner/Fallback-spinner'
import EventRequestsService from '@services/EventRequestsService'

// ** Actions Dropdown Component
const ActionsDropdown = ({ row, isLastRow = false }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const toggle = () => setDropdownOpen(prevState => !prevState)

  const handleEdit = () => {
    // navigate to the action page for editing
    navigate('/new-event-requests/action')
  }

  const handleDelete = () => {
    console.log('Delete clicked for row:', row)
    // Add delete logic here
  }

  return (
    <div style={{ width: '50px', display: 'flex', justifyContent: 'center' }}>
      <Dropdown isOpen={dropdownOpen} toggle={toggle} direction={isLastRow ? "up" : "left"}>
        <DropdownToggle
          tag="div"
          style={{
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px'
          }}
        >
          <MoreVertical size={20} color="#000000" />
        </DropdownToggle>
        <DropdownMenu style={{ minWidth: '120px', width: '100%' }}>
          <DropdownItem
            onClick={handleEdit}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '8px 12px'
            }}
          >
            <Edit size={14} style={{ marginRight: '8px' }} />
            Edit
          </DropdownItem>
          <DropdownItem
            onClick={handleDelete}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '8px 12px'
            }}
          >
            <Trash2 size={14} style={{ marginRight: '8px' }} />
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

const NewEventRequests = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [eventData, setEventData] = useState([])
  const [pending, setPending] = useState(true)
  const [filterText, setFilterText] = useState('')

  // Get page from URL query parameter
  const urlPage = searchParams.get('page')
  const currentPageFromUrl = urlPage ? parseInt(urlPage) : 1
  
  // Get pageSize from URL or default to 10
  const urlPageSize = searchParams.get('limit')
  const defaultPageSize = urlPageSize ? parseInt(urlPageSize) : 10
  
  // Pagination state 
  const [currentPage, setCurrentPage] = useState(currentPageFromUrl - 1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  const fetchData = async (page = 0, limit = pageSize) => {
    try {
      setPending(true)
      const response = await EventRequestsService.getAllEventOrganizersAdmin(page, limit)

      console.log("Fetched event data:", response)
      const eventsArray = response.data.events || response.data || []
      setEventData(eventsArray)
      setTotalRecords(response.data.total || 0)
      setPending(false)
    } catch (error) {
      console.error("Error fetching event data:", error)
      setPending(false)
    }
  }

  // Fetch all data for CSV download
  const fetchAllData = async () => {
    try {
      const countResponse = await EventRequestsService.getAllEventOrganizersAdmin(0, 1)
      const totalRecords = countResponse.data.total || 0
      
      if (totalRecords === 0) {
        return []
      }
      
      const response = await EventRequestsService.getAllEventOrganizersAdmin(0, totalRecords)
      
      console.log("Fetched all event data for CSV:", response)
      const allEventsArray = response.data.events || response.data || []
      return allEventsArray
    } catch (error) {
      console.error("Error fetching all event data:", error)
      return []
    }
  }

  useEffect(() => {
    fetchData(currentPage, pageSize)
  }, [currentPage, pageSize])

  // Handle URL query parameter changes
  useEffect(() => {
    const urlPage = searchParams.get('page')
    const urlLimit = searchParams.get('limit')
    
    const pageFromUrl = urlPage ? parseInt(urlPage) : 1
    const limitFromUrl = urlLimit ? parseInt(urlLimit) : 10
    
    const backendPage = pageFromUrl - 1
    
    // If URL parameters don't match current state, update state
    if (backendPage !== currentPage || limitFromUrl !== pageSize) {
      setCurrentPage(backendPage)
      setPageSize(limitFromUrl)
    }
  }, [searchParams, currentPage, pageSize])

  // Helper function to format date and time
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A'
    
    try {
      const date = new Date(dateTimeString.replace(' ', 'T'))

      return `${date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      })} at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })}`
    } catch (error) {
      console.error('Error formatting date:', error)
      return dateTimeString 
    }
  }

  let filteredItems = []
  if (Array.isArray(eventData)) {
    // For server-side pagination, search on current page data only
    filteredItems = filterText ? eventData.filter(item => JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !== -1) : eventData
  }

  const columns = [
    {
      name: "Event",
      minWidth: "200px",
      sortable: true,
      selector: (row) => row.name || 'N/A'
    },
    {
      name: "Event Status",
      minWidth: "120px",
      sortable: true,
      cell: (row) => {
        let backgroundColor = '#82868B' 
        let text = 'Unknown'

        switch (row.status) {
          case 'pending':
            backgroundColor = '#FF9F43' 
            text = 'Pending'
            break
          case 'approved':
            backgroundColor = '#28C76F' 
            text = 'approved'
            break
          case 'sent back':
            backgroundColor = '#FF5722' 
            text = 'Sent Back'
            break
          case 'rejected':
            backgroundColor = '#EA5455' 
            text = 'Rejected'
            break
          default:
            backgroundColor = '#82868B'
            text = row.status || 'Unknown'
        }

        return (
          <div
            style={{
              height: '28px',
              width: '80px',
              backgroundColor,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              fontFamily: 'Roboto Condensed, sans-serif',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {text}
          </div>
        )
      }
    },
    {
      name: "Organization",
      minWidth: "200px",
      sortable: true,
      selector: (row) => row.partner?.organizationName || 'N/A'
    },
    {
      name: "Organizer",
      minWidth: "150px",
      sortable: true,
      selector: (row) => row.organizer || 'N/A'
    },
    {
      name: "Start Date & Time",
      minWidth: "180px",
      sortable: true,
      selector: (row) => formatDateTime(row.startDate)
    },
    {
      name: "End Date & Time",
      minWidth: "180px",
      sortable: true,
      selector: (row) => formatDateTime(row.endDate)
    },
    {
      name: "Venue",
      minWidth: "200px",
      sortable: true,
      selector: (row) => row.venueId || 'N/A'
    },
    {
      name: "",
      width: "50px",
      cell: (row, index) => <ActionsDropdown row={row} isLastRow={index === filteredItems.length - 1} />
    }
  ]

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result

    const columnDelimiter = ","
    const lineDelimiter = "\n"

    const keys = Object.keys(array[0]).filter(
      (key) =>        key !== "id" &&
        key !== "created_at" &&
        key !== "updated_at"
    )

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

    const filename = "new-event-requests.csv"

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute("href", encodeURI(csv))
    link.setAttribute("download", filename)
    link.click()
  }

  const subHeaderComponent = useMemo(() => {

    return (
      <div style={{ textAlign: 'left', width: '100%', marginTop: '20px' }}>
        <div style={{
          fontFamily: 'Roboto Condensed, sans-serif',
          color: '#6A6775',
          fontSize: '14px',
          fontWeight: 'normal',
          marginBottom: '1px'
        }}>
          Search:
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', justifyContent: 'flex-start' }}>
          <Col md="4" style={{ padding: 0 }}>
            <Input
              id="search"
              type="text"
              placeholder=""
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
            />
          </Col>
          <Button
            style={{
              height: '40px',
              width: '77px',
              borderRadius: '4px',
              backgroundColor: '#82868B',
              border: 'none',
              fontFamily: 'Roboto Condensed, sans-serif',
              fontSize: '16px',
              fontWeight: 'normal',
              color: '#FFFFFF',
              padding: 0
            }}
            onClick={() => {
              setFilterText('')
              fetchData(currentPage, pageSize)  // Refetch current page data
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    )
  }, [filterText])

  return (
    <Card style={{ borderRadius: '5px' }}>
      <CardHeader className="border-bottom" style={{ paddingTop: '27px', paddingBottom: '23px', height: '89px' }}>
        <CardTitle
          style={{
            fontFamily: 'Roboto Condensed, sans-serif',
            color: '#6A6775',
            fontSize: '20px',
            fontWeight: '500',
            height: '39px',
            display: 'flex',
            alignItems: 'center',
            margin: 0
          }}
        >
          Events List
        </CardTitle>

        <div className="d-flex">
          <Col lg="12" md="12">
            <Button
              className="ms-2"
              color="primary"
              style={{ height: '39px' }}
              onClick={async () => {
                const allData = await fetchAllData()
                downloadCSV(allData)
              }}>
              <Download 
                size={18} 
                style={{ 
                  color: window.innerWidth <= 576 ? '#EA5455' : '#FFFFFF' 
                }} 
              />
              <span
                className="align-middle ms-50 d-none d-sm-inline"
                style={{
                  fontFamily: 'Roboto Condensed, sans-serif',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Download CSV
              </span>
            </Button>
          </Col>
        </div>
      </CardHeader>
      <CardBody style={{ padding: '1px' }}>
        <CustomDataTable
          columns={columns}
          data={filteredItems}
          pagination
          paginationServer  // Enable server-side pagination
          paginationTotalRows={totalRecords}  
          paginationPerPage={pageSize}  
          paginationDefaultPage={currentPage + 1}  
          onChangePage={(page) => {
            const newPage = page - 1
            setCurrentPage(newPage)
            setFilterText('')  // Clear search when changing pages
           
            if (page === 1) {
              // Remove page parameter for first page
              const params = {}
              if (pageSize !== 10) params.limit = pageSize.toString()
              setSearchParams(params, { replace: true })
            } else {
              // Set page parameter for pages 2 and above
              const params = { page: page.toString() }
              if (pageSize !== 10) params.limit = pageSize.toString()
              setSearchParams(params)
            }
          }}
          onChangeRowsPerPage={(newPerPage) => {
            setPageSize(newPerPage)
            setCurrentPage(0) // Reset to first page
            setFilterText('') // Clear search
            
           
            const params = {}
            if (currentPageFromUrl > 1) {
              params.page = currentPageFromUrl.toString()
            }
            if (newPerPage !== 10) {
              params.limit = newPerPage.toString()
            }
            setSearchParams(params, { replace: true })
          }}
          progressPending={pending}
          progressComponent={<SpinnerComponent />}
          subHeader
          subHeaderComponent={subHeaderComponent}
        />
      </CardBody>
    </Card>
  )
}

export default NewEventRequests