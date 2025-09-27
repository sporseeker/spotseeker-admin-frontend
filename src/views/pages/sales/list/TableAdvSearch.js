// ** React Imports
import { useEffect, useState, Fragment } from 'react'

// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import ReactPaginate from 'react-paginate'
import { ChevronDown, Eye, Download } from 'react-feather'
import DataTable from 'react-data-table-component'
import Select from 'react-select'

// ** Reactstrap Imports
import { Card, CardHeader, CardBody, CardTitle, Input, Label, Row, Col, Button } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

import EventService from '../../../../services/EventService'
import SalesService from '../../../../services/SalesService'
import { formatNumber } from '../../../../utility/Utils'


const DataTableAdvSearch = () => {
  // ** States
  const [pending, setPending] = useState(false)
  const [SearchEvent, setSearchEvent] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [events, setEventsData] = useState([])

  const advSearchColumns = [
    {
      name: 'Event',
      sortable: true,
      compact: true,
      wrap: true,
      width: "190px",
      selector: row => row.event_name
    },
    {
      name: 'Manager',
      sortable: true,
      wrap: true,
      selector: row => row.organizer
    },
    {
      name: 'Package',
      sortable: true,
      wrap: true,
      selector: row => row.package
    },
    {
      name: 'Price',
      sortable: true,
      selector: row => row.package_price
    },
    {
      name: 'Tot. Tickets',
      sortable: true,
      wrap: true,
      selector: row => row.tot_tickets
    },
    {
      name: 'Res. Tickets',
      sortable: true,
      wrap: true,
      selector: row => row.res_tickets
    },
    {
      name: 'Avail. Tickets',
      sortable: true,
      wrap: true,
      selector: row => row.aval_tickets
    },
    {
      name: 'Sold',
      sortable: true,
      wrap: true,
      selector: row => row.sold_tickets
    },
    {
      name: 'Sold %',
      sortable: true,
      wrap: true,
      selector: row => {
        return `${((row.sold_tickets / (row.tot_tickets - row.res_tickets)) * 100).toFixed(2)} %`
      }
    },
    {
      name: 'Sold Amount',
      sortable: true,
      wrap: true,
      selector: row => {
        return (formatNumber((row.sold_tickets * row.package_price).toFixed(2)))
      }
    }
  ]

  useEffect(() => {
    setEventsData([])
    setData([])
    setPending(true)
    SalesService.getAllSales()
    .then(res => {
      setData(res.data.data)
      setPending(false)
    })
    .catch(err => {
      console.log(err)
    })

    EventService.getAllEvents(['ongoing', 'soldout', 'presale', 'complete', 'closed', 'postponed'])
    .then(res => {
      res.data.data.map(event => {
        const eventObj = {
          value: event.id,
          label: event.name
        }
        setEventsData(events => [...events, eventObj])
      })
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  // ** Function to handle Pagination
  const handlePagination = page => setCurrentPage(page.selected)

  // ** Table data to render
  const dataToRender = () => {
    if (SearchEvent) {
      return filteredData
    } else {
      return data
    }
  }

  const resetFilters = () => {
    setSearchEvent('')
  }

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result

    const columnDelimiter = ','
    const lineDelimiter = '\n'
    const keys = Object.keys(data[0])

    result = ''
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach(item => {
      let ctr = 0
      keys.forEach(key => {
        if (ctr > 0) result += columnDelimiter

        if ((key === 'res_seats' || key === 'unavail_seats') && item[key] && item[key].length) {
          result += item[key].join("|")
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
  function downloadCSV() {
    const link = document.createElement('a')
    const data = dataToRender()
    let csv = convertArrayOfObjectsToCSV(data)
    if (csv === null) return

    const filename = 'export.csv'

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', filename)
    link.click()
  }

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={''}
      nextLabel={''}
      forcePage={currentPage}
      onPageChange={page => handlePagination(page)}
      pageCount={Math.ceil(dataToRender().length / 7) || 1}
      breakLabel={'...'}
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName='active'
      pageClassName='page-item'
      breakClassName='page-item'
      nextLinkClassName='page-link'
      pageLinkClassName='page-link'
      breakLinkClassName='page-link'
      previousLinkClassName='page-link'
      nextClassName='page-item next-item'
      previousClassName='page-item prev-item'
      containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'}
    />
  )

  // ** Function to handle email filter
  const handleEventFilter = e => {
    const value = e.value
    
    const dataToFilter = () => {
        return data
    }

    setSearchEvent(value)

    if (value) {
      const updatedData = dataToFilter().filter(item => {
        return item.event_id === value
      })
      setFilteredData([...updatedData])
      setSearchEvent(value)
    }
  }

  const ExpandedComponent = ({ data }) => (
    <div className="expanded-row">
      <table className="table table-bordered table-sm">
        <thead>
          <tr>
            <th>Addon Name</th>
            <th>Price</th>
            <th>Total Sold</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.addons.map((addon, index) => (
            <tr key={index}>
              <td>{addon.addon_name}</td>
              <td>{addon.addon_price}</td>
              <td>{addon.total_sold}</td>
              <td>{(addon.total_sold * addon.addon_price).toFixed(2)} LKR</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )  

  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Search</CardTitle>
          <div className='d-flex mt-md-0 mt-1'>
            <Button className='ms-2' color='primary' onClick={() => downloadCSV()}>
              <Download size={15} />
              <span className='align-middle ms-50'>Download CSV</span>
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <Row className='mt-1 mb-50'>
            <Col lg='3' md='4' className='mb-1'>
              <Label className='form-label' for='email'>
                Event:
              </Label>
              <Select
                className='react-select'
                classNamePrefix='select'
                options={events}
                isClearable={false}
                value={events.find(({ value }) => value === SearchEvent)}
                onChange={handleEventFilter}
              />
            </Col>
            <Col lg='3' md='4' className='mt-2 mb-1'>
              <Button className='btn btn-outline-dark' onClick={resetFilters}>Reset</Button>
            </Col>
          </Row>
        </CardBody>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            pagination
            columns={advSearchColumns}
            paginationPerPage={7}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationDefaultPage={currentPage + 1}
            paginationComponent={CustomPagination}
            data={dataToRender()}
            defaultSortFieldId={0}
            defaultSortAsc={false}
            progressPending={pending}
            expandableRows
            expandableRowDisabled={(row) => !(row.addons && row.addons.length > 0)}
            expandableRowsComponent={ExpandedComponent}
          />
        </div>
      </Card>
    </Fragment>
  )
}

export default DataTableAdvSearch
