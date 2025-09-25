// ** React Imports
import { useEffect, useState, Fragment } from "react"

// ** Third Party Components
import Flatpickr from "react-flatpickr"
import ReactPaginate from "react-paginate"
import {
  ChevronDown,
  MoreVertical,
  Edit,
  FileText,
  Archive,
  Trash,
  Download,
  Eye
} from "react-feather"
import DataTable from "react-data-table-component"
import Select from "react-select"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Input,
  Label,
  Row,
  Col,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from "reactstrap"

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss"

import BookingService from "../../../../services/BookingService"
import EventService from "../../../../services/EventService"
import BookingEditModal from "./BookingEditModal"
import BookingViewModal from "./BookingViewModal"
import { getStatus, paymentStatuses } from "../../../../utility/Utils"
import AuthService from "../../../../services/AuthService"

import _ from 'lodash'

const MySwal = withReactContent(Swal)

const DataTableAdvSearch = () => {
  // ** States
  const [modal, setModal] = useState(false)
  const [bookingViewModal, setBookingViewModal] = useState(false)
  const [selectedBooking, setBooking] = useState([])
  const [pending, setPending] = useState(false)
  const [Picker, setPicker] = useState("")
  const [searchOrderId, setSearchOrderId] = useState("")
  const [searchEvent, setSearchEvent] = useState("")
  const [searchCustomer, setSearchCustomer] = useState("")
  const [SearchPaymentStatus, setPaymentStatus] = useState("")
  const [searchPaymentRef, setSearchPaymentRef] = useState("")
  const [data, setData] = useState([])
  const [events, setEventsData] = useState([])
  const [refreshData, setRefreshData] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)

  // ** Function to handle Modal toggle
  const handleBookingEditModal = (booking) => {
    setBooking(booking)
    setModal(!modal)
  }
  const handleBookingViewModal = (booking) => {
    setBooking(booking)
    setBookingViewModal(!bookingViewModal)
  }

  const handleAjax = (handleSubmit) => {
    MySwal.fire({
      title: "Enter Admin Password",
      input: "text",
      customClass: {
        input: "mx-3",
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger ms-1"
      },
      buttonsStyling: false,
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Look up",
      showLoaderOnConfirm: true,
      preConfirm(login) {
        return AuthService.verifyAdminUser(login)
          .then(function (response) {
            if (response.data.code !== 200) {
              throw new Error(response.data.message)
            }
            return response
          })
          .catch(function (error) {
            MySwal.showValidationMessage(
              `Request failed:  ${
                error.response ? error.response.data.message : error
              }`
            )
          })
      }
    }).then(function (result) {
      if (result.value) {
        handleSubmit()
          .then((res) => {
            MySwal.fire({
              title: res.data.message,
              icon: "success",
              customClass: {
                confirmButton: "btn btn-primary"
              },
              buttonsStyling: false
            })
            setRefreshData(true)
          })
          .catch((err) => {
            MySwal.fire({
              title: err.response.data.message,
              icon: "error",
              customClass: {
                confirmButton: "btn btn-primary"
              },
              buttonsStyling: false
            })
          })
      }
    })
  }

  const advSearchColumns = [
    {
      name: "Order ID",
      sortable: true,
      compact: true,
      width: "190px",
      selector: (row) => row.order_id
    },
    {
      name: "Pay. Ref",
      sortable: true,
      width: "160px",
      selector: (row) => row.payment_ref_no
    },
    {
      name: "Customer",
      sortable: true,
      wrap: true,
      selector: (row) => row.cust_name
    },
    {
      name: "Event",
      sortable: true,
      wrap: true,
      selector: (row) => row.event_name
    },
    {
      name: "Package",
      sortable: true,
      wrap: true,
      selector: (row) => row.package_name
    },
    {
      name: "Tickets",
      sortable: true,
      width: "80px",
      fixed: true,
      selector: (row) => row.package_tickets
    },
    {
      name: "Amount",
      sortable: true,
      wrap: true,
      selector: (row) => row.tot_amount
    },
    {
      name: "Currency",
      sortable: true,
      wrap: true,
      selector: (row) => row.currency
    },
    {
      name: "Date",
      sortable: true,
      wrap: true,
      selector: (row) => row.date
    },
    {
      name: "Pay. Status",
      sortable: true,
      selector: (row) => {
        return getStatus(row.payment_status)
      }
    },
    {
      name: "Actions",
      allowOverflow: true,
      width: "100px",
      fixed: true,
      cell: (row) => {
        return (
          <div className="d-flex">
            <UncontrolledDropdown direction="start">
              <DropdownToggle className="pe-1" tag="span">
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu container="body">
                <DropdownItem
                  tag="button"
                  className="w-100"
                  onClick={() => handleBookingEditModal(row)}
                >
                  <Edit size={15} />
                  <span className="align-middle ms-50">Edit</span>
                </DropdownItem>
                <DropdownItem
                  tag="button"
                  className="w-100"
                  onClick={handleAjax}
                >
                  <Trash size={15} />
                  <span className="align-middle ms-50">Delete</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <Eye size={15} onClick={() => handleBookingViewModal(row)} />
          </div>
        )
      }
    }
  ]

  const fetchBookings = _.throttle(
    (
      perPage,
      currentPage,
      searchOrderId,
      searchCustomer,
      searchEvent,
      searchPaymentRef,
      SearchPaymentStatus,
      dateRange
    ) => {
      setData([])
      setPending(true)
      BookingService.getAllBookings(
        ["complete"],
        perPage,
        currentPage,
        searchOrderId,
        searchCustomer,
        searchEvent,
        searchPaymentRef,
        SearchPaymentStatus,
        dateRange
      )
        .then((res) => {
          setData(res.data.data.data)
          setTotalRows(res.data.data.total)
          setCurrentPage(res.data.data.current_page)
          setPending(false)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    1000
  )

  useEffect(() => {
    setEventsData([])

    EventService.getAllEvents(['complete'])
    .then(res => {
      res.data.data.map(event => {
        const eventObj = {
          value: event.id,
          label: event.name
        }
        setEventsData(events => [...events, eventObj])

      })
    })
    fetchBookings(
      perPage,
      currentPage,
      "",
      "",
      "",
      "",
      ""
    )
  }, [refreshData])

  // ** Function to handle Pagination
  const handlePagination = (page) => setCurrentPage(page.selected)

  const resetFilters = () => {
    setPicker("")
    setSearchOrderId("")
    setSearchEvent("")
    setSearchCustomer("")
    setPaymentStatus("")
    setSearchPaymentRef("")
    fetchBookings(
      perPage,
      currentPage,
      "",
      "",
      "",
      "",
      ""
    )
  }

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result

    const columnDelimiter = ","
    const lineDelimiter = "\n"
    const keys = Object.keys(data[0])

    result = ""
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach((item) => {
      let ctr = 0
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter

        if (key === "package_seat_nos" && item[key] && item[key].length) {
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
    const link = document.createElement("a")
    let csv = convertArrayOfObjectsToCSV(data)
    if (csv === null) return

    let filename = "booking-list-export.csv"

    if (searchEvent) {
      filename = `${searchEvent}-${filename}`
    }
    if (SearchPaymentStatus) {
      filename = `${SearchPaymentStatus}-${filename}`
    }

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute("href", encodeURI(csv))
    link.setAttribute("download", filename)
    link.click()
  }

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={""}
      nextLabel={""}
      forcePage={currentPage}
      onPageChange={(page) => handlePagination(page)}
      pageCount={Math.ceil(dataToRender().length / 7) || 1}
      breakLabel={"..."}
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName="active"
      pageClassName="page-item"
      breakClassName="page-item"
      nextLinkClassName="page-link"
      pageLinkClassName="page-link"
      breakLinkClassName="page-link"
      previousLinkClassName="page-link"
      nextClassName="page-item next-item"
      previousClassName="page-item prev-item"
      containerClassName={
        "pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
      }
    />
  )

  // ** Function to handle name filter
  const handleOrderIdFilter = (e) => {
    const value = e.target.value
    setSearchOrderId(value)
    fetchBookings(
      perPage,
      currentPage,
      value,
      searchCustomer,
      searchEvent,
      searchPaymentRef,
      SearchPaymentStatus
    )
  }

  // ** Function to handle event filter
  const handleEventFilter = (e) => {
    const value = e.value
    setSearchEvent(value)

    fetchBookings(
      perPage,
      currentPage,
      searchOrderId,
      searchCustomer,
      value,
      searchPaymentRef,
      SearchPaymentStatus
    )
  }

  // ** Function to handle payment status filter
  const handlePayStatusFilter = (e) => {
    const value = e.value
    setPaymentStatus(value)
    fetchBookings(
      perPage,
      currentPage,
      searchOrderId,
      searchCustomer,
      searchEvent,
      searchPaymentRef,
      value
    )
  }

  // ** Function to handle customer filter
  const handleCustomerFilter = (e) => {
    const value = e.target.value
    setSearchCustomer(value)
    fetchBookings(
      perPage,
      currentPage,
      searchOrderId,
      value,
      searchEvent,
      searchPaymentRef,
      SearchPaymentStatus
    )
  }

  // ** Function to handle payment ref filter
  const handlePaymentRefFilter = (e) => {
    const value = e.target.value
    setSearchPaymentRef(value)
    fetchBookings(
      perPage,
      currentPage,
      searchOrderId,
      searchCustomer,
      searchEvent,
      value,
      SearchPaymentStatus
    )
  }

  // ** Function to handle date filter
  const handleDateFilter = (range) => {
    const arr = []

    range.map((i) => {
      const date = new Date(i)

      const year = date.getFullYear()

      let month = (1 + date.getMonth()).toString()
      month = month.length > 1 ? month : `0${month}`

      let day = date.getDate().toString()
      day = day.length > 1 ? day : `0${day}`

      arr.push(`${month}/${day}/${year}`)
      return true
    })

    if (arr.length === 2) {
      fetchBookings(
        perPage,
        currentPage,
        searchOrderId,
        searchCustomer,
        searchEvent,
        searchPaymentRef,
        SearchPaymentStatus,
        [arr[0], arr[1]]
      )
      setPicker(range)
    }
  }

  const handlePageChange = (page) => {
    fetchBookings(
      perPage,
      page,
      searchOrderId,
      searchCustomer,
      searchEvent,
      searchPaymentRef,
      SearchPaymentStatus
    )
  }

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage)
    fetchBookings(
      newPerPage,
      page,
      searchOrderId,
      searchCustomer,
      searchEvent,
      searchPaymentRef,
      SearchPaymentStatus
    )
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Search</CardTitle>
          <div className="d-flex mt-md-0 mt-1">
            <Button className="ms-2" color="primary" onClick={downloadCSV}>
              <Download size={15} />
              <span className="align-middle ms-50">Download CSV</span>
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <Row className="mt-1 mb-50">
            <Col lg="3" md="4" className="mb-1">
              <Label className="form-label" for="name">
                Order ID:
              </Label>
              <Input
                id="name"
                value={searchOrderId}
                onChange={handleOrderIdFilter}
              />
            </Col>
            <Col lg="3" md="4" className="mb-1">
              <Label className="form-label" for="email">
                Event:
              </Label>
              <Select
                className="react-select"
                classNamePrefix="select"
                defaultValue={events[0]}
                options={events}
                isClearable={false}
                onChange={handleEventFilter}
                value={searchEvent}
                isLoading={pending}
              />
            </Col>
            <Col lg="3" md="4" className="mb-1">
              <Label className="form-label" for="post">
                Payment Status:
              </Label>
              <Select
                className="react-select"
                classNamePrefix="select"
                options={paymentStatuses}
                isClearable={false}
                onChange={handlePayStatusFilter}
              />
            </Col>
            <Col lg="3" md="4" className="mb-1">
              <Label className="form-label" for="city">
                Customer Detail:
              </Label>
              <Input
                id="city"
                value={searchCustomer}
                onChange={handleCustomerFilter}
              />
            </Col>
            <Col lg="3" md="4" className="mb-1">
              <Label className="form-label" for="date">
                Date:
              </Label>
              <Flatpickr
                className="form-control"
                id="date"
                value={Picker}
                options={{ mode: "range", dateFormat: "m/d/Y" }}
                onChange={(date) => handleDateFilter(date)}
              />
            </Col>
            <Col lg="3" md="4" className="mb-1">
              <Label className="form-label" for="salary">
                Payment Ref:
              </Label>
              <Input
                id="salary"
                value={searchPaymentRef}
                onChange={handlePaymentRefFilter}
              />
            </Col>
            <Col lg="3" md="4" className="mt-2 mb-1">
              <Button className="btn btn-outline-dark" onClick={resetFilters}>
                Reset
              </Button>
            </Col>
          </Row>
        </CardBody>
        <div className="react-dataTable">
          <DataTable
            noHeader
            pagination
            columns={advSearchColumns}
            className="react-dataTable"
            sortIcon={<ChevronDown size={10} />}
            data={data}
            defaultSortFieldId={9}
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
      <BookingEditModal
        open={modal}
        handleModal={handleBookingEditModal}
        booking={selectedBooking}
        handleAjax={handleAjax}
      />
      <BookingViewModal
        open={bookingViewModal}
        handleModal={handleBookingViewModal}
        booking={selectedBooking}
      />
    </Fragment>
  )
}

export default DataTableAdvSearch
