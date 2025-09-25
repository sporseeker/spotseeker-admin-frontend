// ** React Imports
import React, { useEffect, useState, Fragment } from "react"

// ** Third Party Components
import ReactPaginate from "react-paginate"
import {
  ChevronDown,
  Eye,
  Download,
  MoreVertical,
  Edit,
  Trash,
  Send
} from "react-feather"
import DataTable from "react-data-table-component"

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
  Button,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  DropdownItem
} from "reactstrap"

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss"

// ** Services
import UserService from "../../../../services/UserService"
import AuthService from "../../../../services/AuthService"

import { useParams } from "react-router-dom"
import UserEditModal from "./UserEditModal"
import { Alert } from "../../../../utility/alerts"
import { formatTimestamp, getStatus } from "../../../../utility/Utils"
/*const useQuery = () => {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}*/

const DataTableAdvSearch = () => {
  // ** States
  const [pending, setPending] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState([])
  const [searchCustomer, setSearchCustomer] = useState("")
  const [modal, setModal] = useState(false)
  const [selectedUser, setUser] = useState([])
  const [dataUpdated, setDataUpdate] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)

  //const query = useQuery().get("type")
  const { type } = useParams()

  const handlePasswordResetSend = (email) => {
    AuthService.sendPasswordResetEmail(email)
      .then(() => {
        Alert("Password reset email sent successfully", "success")
      })
      .catch((err) => {
        Alert(err.response.data.message, "error")
      })
  }

  const handleUserEditModal = (user) => {
    setUser(user)
    setModal(!modal)
  }

  const handleUserDelete = (user) => {
    UserService.deleteUser(user.id)
      .then(() => {
        setDataUpdate(!dataUpdated)
        Alert("User removed successfully", "success")
      })
      .catch((err) => {
        Alert(err.response.data.message, "error")
      })
  }

  const handleUserDeactivate = (user) => {
    UserService.deactivateUser(user.id)
      .then(() => {
        setDataUpdate(!dataUpdated)
        Alert("User deactivated successfully", "success")
      })
      .catch((err) => {
        Alert(err.response.data.message, "error")
      })
  }

  const handleUserActivate = (user) => {
    UserService.activateUser(user.id)
      .then(() => {
        setDataUpdate(!dataUpdated)
        Alert("User activated successfully", "success")
      })
      .catch((err) => {
        Alert(err.response.data.message, "error")
      })
  }

  const advSearchColumns = [
    {
      name: "id",
      sortable: true,
      compact: true,
      wrap: true,
      width: "100px",
      selector: (row) => row.id
    },
    {
      name: "Full Name",
      sortable: true,
      wrap: true,
      width: "300px",
      selector: (row) => {
        return row.name
      }
    },
    {
      name: "Email",
      sortable: true,
      wrap: true,
      width: "300px",
      selector: (row) => row.email
    },
    {
      name: "Phone",
      sortable: true,
      width: "150px",
      selector: (row) => row.phone_no
    },
    {
      name: "NIC",
      sortable: true,
      width: "150px",
      selector: (row) => row.nic
    },
    {
      name: "Status",
      sortable: true,
      selector: (row) => {
        return getStatus(row.status)
      }
    },
    {
      name: "Joined On",
      sortable: true,
      width: "300px",
      selector: (row) => formatTimestamp(row.created_at) 
    },
    {
      name: "Actions",
      allowOverflow: true,
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
                  onClick={() => handleUserEditModal(row)}
                >
                  <Edit size={15} />
                  <span className="align-middle ms-50">Edit</span>
                </DropdownItem>
                {row.status ? (
                  <DropdownItem
                    tag="button"
                    className="w-100"
                    onClick={() => handleUserDeactivate(row)}
                  >
                    <Trash size={15} />
                    <span className="align-middle ms-50">Deactivate</span>
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    tag="button"
                    className="w-100"
                    onClick={() => handleUserActivate(row)}
                  >
                    <Trash size={15} />
                    <span className="align-middle ms-50">Activate</span>
                  </DropdownItem>
                )}
                <DropdownItem
                  tag="button"
                  className="w-100"
                  onClick={() => handleUserDelete(row)}
                >
                  <Trash size={15} />
                  <span className="align-middle ms-50">Delete</span>
                </DropdownItem>
                <DropdownItem
                  tag="button"
                  className="w-100"
                  onClick={() => handlePasswordResetSend(row.email)}
                >
                  <Send size={15} />
                  <span className="align-middle ms-50">
                    Send Password Reset Email
                  </span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        )
      }
    }
  ]

  const fetchUsers = (type, perPage, currentPage, search) => {
    setData([])
    setPending(true)
    UserService.getAllUserByRole(type, perPage, currentPage, search, false, "created_at")
      .then((res) => {
        setData(res.data.data.data)
        setTotalRows(res.data.data.total)
        setCurrentPage(res.data.data.current_page)
        setPending(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    fetchUsers(type, perPage, currentPage, searchCustomer)
  }, [dataUpdated, searchCustomer])

  // ** Function to handle Pagination
  const handlePagination = (page) => setCurrentPage(page.selected)

  const resetFilters = () => {
    setSearchCustomer("")
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

        result += item[key]

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

    const filename = "export.csv"

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

  // ** Function to handle email filter
  const handleCustomerFilter = (e) => {
    const value = e.target.value
    
    setSearchCustomer(value)
    if (value.length) {
      setSearchCustomer(value)
    }
  }

  const handlePageChange = (page) => {
    fetchUsers(type, perPage, page)
  }

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage)
    fetchUsers(type, newPerPage, page)
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Search</CardTitle>
          <div className="d-flex mt-md-0 mt-1">
            <Button
              className="ms-2"
              color="primary"
              onClick={() => downloadCSV(data)}
            >
              <Download size={15} />
              <span className="align-middle ms-50">Download CSV</span>
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <Row className="mt-1 mb-50">
            <Col lg="3" md="4" className="mb-1">
              <Label className="form-label" for="email">
                Search:
              </Label>
              <Input
                id="salary"
                value={searchCustomer}
                onChange={handleCustomerFilter}
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
            defaultSortFieldId={1}
            defaultSortAsc={false}
            progressPending={pending}
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            paginationRowsPerPageOptions={[10, 50, 100, 1000, 5000, 10000, 100000]}
          />
        </div>
      </Card>
      <UserEditModal
        open={modal}
        handleModal={handleUserEditModal}
        user={selectedUser}
      />
    </Fragment>
  )
}

export default DataTableAdvSearch
