// ** React Imports
import { useEffect, useState, Fragment } from 'react'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, Eye, Download, MoreVertical, Edit, Trash } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import { Card, CardHeader, CardBody, CardTitle, DropdownMenu, DropdownToggle, UncontrolledDropdown, Button, Badge, DropdownItem, Row, Col, Label, Input } from 'reactstrap'


// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

import EventService from '../../../../services/EventService'
import { Alert } from '../../../../utility/alerts'
import { eventStatuses, formatTimestamp, getStatus } from '../../../../utility/Utils'


const DataTableAdvSearch = () => {
  // ** States

  const [pending, setPending] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [data, setData] = useState([])
  const [eventSearch, setEventSearch] = useState("")


  const handleRemove = (event) => {
    EventService.deleteEvent(event.id)
    .then(res => {
      Alert(res.data.message, "success")
    })
    .catch(err => {
      Alert(err.response.data.message, "error")
    })
  }

  const advSearchColumns = [
    {
      name: 'Event',
      sortable: true,
      compact: true,
      wrap: true,
      width: "190px",
      selector: row => row.name
    },
    {
      name: 'Manager',
      sortable: true,
      wrap: true,
      selector: row => row.manager.name
    },
    {
      name: 'Organizer',
      sortable: true,
      wrap: true,
      selector: row => row.organizer
    },
    {
      name: 'Start Date',
      sortable: true,
      wrap: true,
      selector: row => formatTimestamp(row.start_date) 
    },
    {
      name: 'Venue',
      sortable: true,
      wrap: true,
      width: '250px',
      selector: row => row.venue.name
    },
    {
      name: 'Featured',
      sortable: true,
      selector: row => {
        let color = ''
        let text = ''
        if (row.featured) {
          color = 'success'
          text = 'Yes'
        } else {
          color = 'danger'
          text = 'No'
        }
        return (
          <Badge color={color} className='badge-glow'>
            {text}
          </Badge>
        )
      }
    },
    {
      name: 'Status',
      sortable: true,
      selector: row => {
        return getStatus(row.status)
      }
    },
    {
      name: 'Actions',
      allowOverflow: true,
      width: "100px",
      fixed: true,
      cell: (row) => {
        return (
          <div className='d-flex' >
            <UncontrolledDropdown direction="start">
              <DropdownToggle className='pe-1' tag='span'>
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu container="body">
                <DropdownItem tag='button' className='w-100' href={`/events/edit/${row.id}`} >
                  <Edit size={15} />
                  <span className='align-middle ms-50'>Edit</span>
                </DropdownItem>
                <DropdownItem tag='button' className='w-100' >
                  <Trash size={15} />
                  <span className='align-middle ms-50' onClick={() => handleRemove(row)}>Delete</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <Eye size={15} />
          </div>
        )
      }
    }
  ]


  const fetchEvents = (status, perPage, page, eventSearch) => {
    setPending(true)
    EventService.getAllEvents(status, perPage, page, eventSearch)
    .then(res => {
      setData(res.data.data.data)
      setPending(false)
      setTotalRows(res.data.data.total)
      setCurrentPage(res.data.data.current_page)
    })
    .catch(err => {
      console.log(err)
      setPending(false)
    })
  }

  useEffect(() => {

    setData([])
    fetchEvents(eventStatuses.map(event => event.value), perPage, currentPage, eventSearch)
  }, [eventSearch])


  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result

    const columnDelimiter = ','
    const lineDelimiter = '\n'
    
    const keys = Object.keys(array[0]).filter(
        key => key !== 'description' && key !== 'ticket_packages' && key !== 'promo'
    )

    result = ''
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach(item => {
        let ctr = 0
        keys.forEach(key => {
            if (ctr > 0) result += columnDelimiter

            // Check if the current key is 'manager.name', if so, extract the nested value
            if (key === 'manager') {
                result += item.manager.name || '' // Use empty string if manager.name is null or undefined
            } else if (key === 'venue') {
              result += item.venue.name || ''
            } else {
                result += item[key]
            }

            ctr++
        })
        result += lineDelimiter
    })

    return result
}

  // ** Downloads CSV
  function downloadCSV(array) {
    const link = document.createElement('a')
    let csv = convertArrayOfObjectsToCSV(array)
    if (csv === null) return

    const filename = 'export.csv'

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', filename)
    link.click()
  }

  const handlePageChange = (page) => {
    fetchEvents(
      eventStatuses.map(event => event.value), perPage, page
    )
  }

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage)

    fetchEvents(
      eventStatuses.map(event => event.value), newPerPage, page
    )
  }

  const handleEventFilter = (e) => {
    const value = e.target.value
    if (value.length) {
      setEventSearch(value)
    }
  }

  const resetFilters = () => {
    setEventSearch("")
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Events List</CardTitle>
          <Row>
            { pending ? "" : <Col lg="6" md="6">
             <Button className='ms-2' color='primary' onClick={() => downloadCSV(data)}>
              <Download size={15} />
              <span className='align-middle ms-50'>Download CSV</span>
            </Button>
            
            </Col> }
          </Row>
        </CardHeader>
        <CardBody>
          <Row className="mt-1 mb-50">
            <Col lg="3" md="4" className="mb-1">
              <Label className="form-label" for="eventSearch">
                Search:
              </Label>
              <Input
                id="eventSearch"
                value={eventSearch}
                onChange={handleEventFilter}
              />
            </Col>
            <Col lg="3" md="4" className="mt-2 mb-1">
              <Button className="btn btn-outline-dark" onClick={resetFilters}>
                Reset
              </Button>
            </Col>
          </Row>
        </CardBody>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            pagination
            columns={advSearchColumns}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            data={data}
            defaultSortFieldId={0}

            defaultSortAsc={false}
            progressPending={pending}
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            paginationRowsPerPageOptions={[10, 50, 100, 1000, 10000]}
          />
        </div>
      </Card>
    </Fragment>
  )
}

export default DataTableAdvSearch
