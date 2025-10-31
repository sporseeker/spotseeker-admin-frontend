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
import PartnershipAgreementsService from "@services/PartnershipAgreementsService"
import DataTable from "react-data-table-component"
import { Link, useNavigate } from "react-router-dom"
import { Download, Edit, Trash2, MoreVertical, CheckCircle, XCircle, Clock, Eye, FileText } from "react-feather"
import SpinnerComponent from "../../../../@core/components/spinner/Fallback-spinner"
import { Alert } from "@alerts"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

const PartnershipAgreementsList = () => {
  const navigate = useNavigate()
  const [agreements, setAgreements] = useState([])
  const [pending, setPending] = useState(true)
  const [filterText, setFilterText] = useState("")
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(0)

  const fetchAgreements = (page = 0, limit = 10) => {
    setPending(true)
    PartnershipAgreementsService.getAllEventOrganizers(page, limit)
      .then((res) => {
        setAgreements(res.data.partners || [])
        setTotalRows(res.data.total || 0)
        setPending(false)
      })
      .catch((err) => {
        console.log(err)
        Alert(err.response?.data?.message || "Failed to fetch partnership agreements", "error")
        setPending(false)
      })
  }

  useEffect(() => {
    fetchAgreements(currentPage, perPage)
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
        PartnershipAgreementsService.deleteEventOrganizer(id)
          .then(() => {
            Alert("Partnership agreement deleted successfully", "success")
            fetchAgreements(currentPage, perPage)
          })
          .catch((err) => {
            Alert(err.response?.data?.message || "Failed to delete partnership agreement", "error")
          })
      }
    })
  }

  const getAgreementStatusBadge = (agreementAccepted) => {
    return (
      <Badge color={agreementAccepted ? "success" : "warning"} className="d-flex align-items-center gap-50">
        {agreementAccepted ? <CheckCircle size={14} /> : <Clock size={14} />}
        <span>{agreementAccepted ? "Accepted" : "Pending"}</span>
      </Badge>
    )
  }

  const getOnboardingStepBadge = (step) => {
    const stepConfig = {
      COMPANY_PROFILE: { color: "info", label: "Company Profile" },
      ORGANIZER_INFO: { color: "primary", label: "Organizer Info" },
      AGREEMENT: { color: "warning", label: "Agreement" },
      COMPLETE: { color: "success", label: "Complete" }
    }
    
    const config = stepConfig[step] || { color: "secondary", label: step || "N/A" }
    
    return (
      <Badge color={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getBusinessRegBadge = (hasReg) => {
    return (
      <Badge color={hasReg ? "success" : "secondary"}>
        {hasReg ? "Yes" : "No"}
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
      name: "Organization",
      sortable: true,
      minWidth: "200px",
      selector: (row) => row.organization_name || "N/A"
    },
    {
      name: "Organizer Name",
      sortable: true,
      minWidth: "180px",
      selector: (row) => row.organizer_name || "N/A"
    },
    {
      name: "Email",
      sortable: true,
      minWidth: "220px",
      selector: (row) => row.business_email || row.email || "N/A"
    },
    {
      name: "Mobile",
      sortable: true,
      minWidth: "150px",
      selector: (row) => row.organizer_mobile || row.mobile || "N/A"
    },
    {
      name: "Onboarding Step",
      sortable: true,
      minWidth: "180px",
      cell: (row) => getOnboardingStepBadge(row.onboarding_step)
    },
    {
      name: "Agreement Status",
      sortable: true,
      minWidth: "170px",
      cell: (row) => getAgreementStatusBadge(row.agreement_accepted)
    },
    {
      name: "Signed At",
      sortable: true,
      minWidth: "180px",
      selector: (row) => (row.signed_at ? new Date(row.signed_at).toLocaleString() : "Not Signed")
    },
    {
      name: "Business Reg",
      sortable: true,
      minWidth: "130px",
      cell: (row) => getBusinessRegBadge(row.has_business_registration)
    },
    {
      name: "Signature",
      sortable: true,
      minWidth: "120px",
      cell: (row) => (
        <Badge color={row.signature_file ? "success" : "secondary"}>
          {row.signature_file ? "Available" : "N/A"}
        </Badge>
      )
    },
    {
      name: "Bank Details",
      sortable: true,
      minWidth: "150px",
      cell: (row) => {
        const hasBank = row.bank_name && row.account_number
        return (
          <Badge color={hasBank ? "success" : "warning"}>
            {hasBank ? "Complete" : "Incomplete"}
          </Badge>
        )
      }
    },
    {
      name: "Created At",
      sortable: true,
      minWidth: "180px",
      selector: (row) => (row.created_at ? new Date(row.created_at).toLocaleString() : "N/A")
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
              onClick={() => navigate(`/partner-agreements/view/${row.id}`)}
            >
              <Eye size={14} className="me-50" />
              <span className="align-middle">View Details</span>
            </DropdownItem>
            <DropdownItem
              className="w-100"
              onClick={() => navigate(`/partner-agreements/agreement/${row.id}`)}
            >
              <FileText size={14} className="me-50" />
              <span className="align-middle">View Agreement</span>
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
      "id", "organization_name", "organizer_name", "organizer_nic", 
      "organizer_mobile", "business_email", "email", "mobile",
      "onboarding_step", "agreement_accepted", "signed_at",
      "has_business_registration", "business_registration_file",
      "signature_file", "bank_name", "account_number", 
      "account_holder_name", "branch", "registered_address",
      "organizer_address", "id_type", "facebook_url", "instagram_url",
      "created_at", "updated_at"
    ]

    result = ""
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach((item) => {
      let ctr = 0
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter
        const value = item[key]
        // Handle values properly for CSV
        if (value === null || value === undefined) {
          result += ""
        } else if (typeof value === 'boolean') {
          result += value ? "Yes" : "No"
        } else {
          result += value
        }
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

    const filename = "partnership_agreements_export.csv"

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute("href", encodeURI(csv))
    link.setAttribute("download", filename)
    link.click()
  }

  const filteredItems = agreements.filter(
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
        <h4 className="mb-0">Partnership Agreements</h4>
        <div className="d-flex mt-md-0 mt-1">
          <Button
            className="ms-2"
            color="primary"
            onClick={() => downloadCSV(agreements)}
            disabled={agreements.length === 0}
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

export default PartnershipAgreementsList