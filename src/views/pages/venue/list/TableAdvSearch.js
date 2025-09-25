// ** React Imports
import { useEffect, useState, Fragment } from 'react'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, Eye, Download, MoreVertical, Edit, Trash } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, Button, DropdownMenu, DropdownToggle, UncontrolledDropdown, DropdownItem } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

// ** Services
import VenueService from '../../../../services/VenueService'
import { Alert } from '../../../../utility/alerts'
import { formatTimestamp } from '../../../../utility/Utils'


const DataTableAdvSearch = () => {
  // ** States
  const [pending, setPending] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [data, setData] = useState([])

  const deleteVenue = (id) => {
    VenueService.deleteVenue(id).then((res) => {
      Alert(res.data.message.toUpperCase(), "success")
      setPending(false)
      location.reload()
    })
    .catch((err) => {
      Alert(err.response.data.message.toUpperCase(), "error")
      setPending(false)
    })
  }

  const advSearchColumns = [
    {
      name: 'Name',
      sortable: true,
      compact: true,
      wrap: true,
      width: "390px",
      selector: row => row.name
    },
    {
      name: 'Location URL',
      sortable: true,
      wrap: true,
      selector: row => row.location_url
    },
    {
      name: 'Created At',
      sortable: true,
      wrap: true,
      selector: row => formatTimestamp(row.created_at) 
    },
    {
      name: 'Updated At',
      sortable: true,
      selector: row => formatTimestamp(row.updated_at)
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
                <DropdownItem tag='button' className='w-100' href={`/venues/edit/${row.id}`} >
                  <Edit size={15} />
                  <span className='align-middle ms-50'>Edit</span>
                </DropdownItem>
                <DropdownItem tag='button' className='w-100' onClick={() => deleteVenue(row.id)}>
                  <Trash size={15} />
                  <span className='align-middle ms-50'>Delete</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <Eye size={15} />
          </div>
        )
      }
    }
  ]

  useEffect(() => {
    setData([])
    setPending(true)
    VenueService.getAllVenues()
    .then(res => {
      setData(res.data.data)
      setPending(false)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  // ** Function to handle Pagination
  const handlePagination = page => setCurrentPage(page.selected)

  // ** Table data to render
  const dataToRender = () => {
    return data
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

        result += item[key]

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

  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Search</CardTitle>
          <div className='d-flex mt-md-0 mt-1'>
            <Button className='ms-2' color='primary' onClick={() => downloadCSV(data)}>
              <Download size={15} />
              <span className='align-middle ms-50'>Download CSV</span>
            </Button>
          </div>
        </CardHeader>
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
            defaultSortFieldId={4}
            defaultSortAsc={false}
            progressPending={pending}
          />
        </div>
      </Card>
    </Fragment>
  )
}

export default DataTableAdvSearch
