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
import PartnershipAgreementsService from "@services/PartnershipAgreementsService"
import DataTable from "react-data-table-component"
import { Download, CheckCircle, Clock } from "react-feather"
import SpinnerComponent from "../../../../@core/components/spinner/Fallback-spinner"
import { Alert } from "@alerts"

const PartnershipAgreementsList = () => {
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

  const getIdTypeBadge = (idType) => {
    const typeConfig = {
      NIC: { color: "primary", label: "NIC" },
      DRIVING_LICENSE: { color: "info", label: "Driving License" },
      PASSPORT: { color: "success", label: "Passport" }
    }
    
    const config = typeConfig[idType] || { color: "secondary", label: idType || "N/A" }
    
    return (
      <Badge color={config.color}>
        {config.label}
      </Badge>
    )
  }

  const columns = [
    {
      name: "ID",
      sortable: true,
      minWidth: "70px",
      selector: (row) => row.id || 0
    },
    {
      name: "Organization",
      sortable: true,
      minWidth: "180px",
      selector: (row) => row.organization_name || "N/A"
    },
    {
      name: "Organizer Name",
      sortable: true,
      minWidth: "160px",
      selector: (row) => row.organizer_name || "N/A"
    },
    {
      name: "NIC",
      sortable: true,
      minWidth: "140px",
      selector: (row) => row.organizer_nic || "N/A"
    },
    {
      name: "ID Type",
      sortable: true,
      minWidth: "140px",
      cell: (row) => getIdTypeBadge(row.id_type)
    },
    {
      name: "Mobile",
      sortable: true,
      minWidth: "130px",
      selector: (row) => row.organizer_mobile || "N/A"
    },
    {
      name: "Business Email",
      sortable: true,
      minWidth: "200px",
      selector: (row) => row.business_email || "N/A"
    },
    {
      name: "Onboarding Step",
      sortable: true,
      minWidth: "160px",
      cell: (row) => getOnboardingStepBadge(row.onboarding_step)
    },
    {
      name: "Agreement Status",
      sortable: true,
      minWidth: "160px",
      cell: (row) => getAgreementStatusBadge(row.agreement_accepted)
    },
    {
      name: "Signed At",
      sortable: true,
      minWidth: "160px",
      selector: (row) => (row.signed_at ? new Date(row.signed_at).toLocaleString() : "Not Signed")
    },
    {
      name: "Business Reg",
      sortable: true,
      minWidth: "130px",
      cell: (row) => (
        <Badge color={row.has_business_registration ? "success" : "secondary"}>
          {row.has_business_registration ? "Yes" : "No"}
        </Badge>
      )
    },
    {
      name: "Bank Details",
      sortable: true,
      minWidth: "140px",
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
      name: "Bank Name",
      sortable: true,
      minWidth: "140px",
      selector: (row) => row.bank_name || "N/A"
    },
    {
      name: "Account Number",
      sortable: true,
      minWidth: "150px",
      selector: (row) => row.account_number || "N/A"
    },
    {
      name: "Account Holder",
      sortable: true,
      minWidth: "160px",
      selector: (row) => row.account_holder_name || "N/A"
    },
    {
      name: "Branch",
      sortable: true,
      minWidth: "130px",
      selector: (row) => row.branch || "N/A"
    },
    {
      name: "Registered Address",
      sortable: true,
      minWidth: "200px",
      selector: (row) => row.registered_address || "N/A"
    },
    {
      name: "Organizer Address",
      sortable: true,
      minWidth: "200px",
      selector: (row) => row.organizer_address || "N/A"
    },
    {
      name: "Facebook URL",
      sortable: true,
      minWidth: "150px",
      cell: (row) => row.facebook_url ? (
        <a href={row.facebook_url} target="_blank" rel="noopener noreferrer" className="text-primary">
          View
        </a>
      ) : "N/A"
    },
    {
      name: "Instagram URL",
      sortable: true,
      minWidth: "150px",
      cell: (row) => row.instagram_url ? (
        <a href={row.instagram_url} target="_blank" rel="noopener noreferrer" className="text-primary">
          View
        </a>
      ) : "N/A"
    },
    {
      name: "Created At",
      sortable: true,
      minWidth: "160px",
      selector: (row) => (row.created_at ? new Date(row.created_at).toLocaleString() : "N/A")
    },
    {
      name: "Updated At",
      sortable: true,
      minWidth: "160px",
      selector: (row) => (row.updated_at ? new Date(row.updated_at).toLocaleString() : "N/A")
    }
  ]

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result
    const columnDelimiter = ","
    const lineDelimiter = "\n"

    const keys = [
      "id", "organization_name", "organizer_name", "organizer_nic", 
      "id_type", "organizer_mobile", "business_email",
      "onboarding_step", "agreement_accepted", "signed_at",
      "has_business_registration", "business_registration_file",
      "signature_file", "bank_name", "account_number", 
      "account_holder_name", "branch", "registered_address",
      "organizer_address", "id_front_file", "id_back_file",
      "facebook_url", "instagram_url",
      "created_at", "updated_at", "user_id"
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
          result += `"${String(value).replace(/"/g, '""')}"`
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

    const filename = `partnership_agreements_${new Date().toISOString().split('T')[0]}.csv`

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
        placeholder="Filter partners..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
    </Col>
  ), [filterText])

  return (
    <Card>
      <CardHeader className="border-bottom">
        <h4 className="mb-0">Partnership Agreements - Partner Details</h4>
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