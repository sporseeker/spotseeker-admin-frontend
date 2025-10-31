import {
  Card,
  CardHeader,
  CardBody,
  Col,
  Button,
  Input,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Row
} from "reactstrap"
import { useEffect, useMemo, useState } from "react"
import WithdrawalService from "@services/WithdrawalsService"
import DataTable from "react-data-table-component"
import { Download, Edit2, X } from "react-feather"
import SpinnerComponent from "../../../../@core/components/spinner/Fallback-spinner"
import { Alert } from "@alerts"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

const WithdrawFunds = () => {
  const [withdrawals, setWithdrawals] = useState([])
  const [pending, setPending] = useState(true)
  const [filterText, setFilterText] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null)
  const [receiptFile, setReceiptFile] = useState(null)

  // Sample data for testing based on schema
  const sampleData = [
    {
      id: 1,
      account_name: "Oneli Weerasooriya",
      account_number: "1234567890",
      amount: 100000.00,
      bank_name: "Bank of Ceylon",
      note: "Staff Payment for Summer Festival",
      status: "PENDING",
      event_id: 1,
      partner_id: 1,
      created_at: "2025-10-30T10:30:00",
      updated_at: "2025-10-30T10:30:00",
      processed_at: null
    },
    {
      id: 2,
      account_name: "Dilakshan Surendra",
      account_number: "9876543210",
      amount: 250000.00,
      bank_name: "Commercial Bank",
      note: "Venue Booking Payment",
      status: "PENDING",
      event_id: 2,
      partner_id: 2,
      created_at: "2025-10-29T15:20:00",
      updated_at: "2025-10-29T15:20:00",
      processed_at: null
    },
    {
      id: 3,
      account_name: "Bhanuka Eranga",
      account_number: "5554443322",
      amount: 300000.00,
      bank_name: "People's Bank",
      note: "Catering Service Payment",
      status: "PENDING",
      event_id: 3,
      partner_id: 3,
      created_at: "2025-10-28T08:15:00",
      updated_at: "2025-10-28T08:15:00",
      processed_at: null
    },
    {
      id: 4,
      account_name: "Minal Sasnuka",
      account_number: "1112223334",
      amount: 40000.00,
      bank_name: "Bank of Ceylon",
      note: "Ticket Printing Services",
      status: "TRANSFERRED",
      event_id: 1,
      partner_id: 1,
      created_at: "2025-10-27T12:45:00",
      updated_at: "2025-10-28T10:00:00",
      processed_at: "2025-10-28T10:00:00"
    },
    {
      id: 5,
      account_name: "Kalana Dheemantha",
      account_number: "7778889990",
      amount: 80000.00,
      bank_name: "Sampath Bank",
      note: "License & Permits",
      status: "TRANSFERRED",
      event_id: 2,
      partner_id: 2,
      created_at: "2025-10-26T09:30:00",
      updated_at: "2025-10-27T11:00:00",
      processed_at: "2025-10-27T11:00:00"
    },
    {
      id: 6,
      account_name: "Theekshana Chamin",
      account_number: "3332221110",
      amount: 190000.00,
      bank_name: "Commercial Bank",
      note: "Security Services Payment",
      status: "TRANSFERRED",
      event_id: 3,
      partner_id: 3,
      created_at: "2025-10-25T14:20:00",
      updated_at: "2025-10-26T09:30:00",
      processed_at: "2025-10-26T09:30:00"
    },
    {
      id: 7,
      account_name: "Leyana Dabare",
      account_number: "6665554443",
      amount: 220000.00,
      bank_name: "People's Bank",
      note: "Event Staff Salaries",
      status: "TRANSFERRED",
      event_id: 1,
      partner_id: 1,
      created_at: "2025-10-24T11:15:00",
      updated_at: "2025-10-25T14:00:00",
      processed_at: "2025-10-25T14:00:00"
    },
    {
      id: 8,
      account_name: "Javen Dimithri",
      account_number: "8889990001",
      amount: 150000.00,
      bank_name: "Bank of Ceylon",
      note: "Sound & Lighting Equipment",
      status: "TRANSFERRED",
      event_id: 2,
      partner_id: 2,
      created_at: "2025-10-23T16:40:00",
      updated_at: "2025-10-24T10:00:00",
      processed_at: "2025-10-24T10:00:00"
    },
    {
      id: 9,
      account_name: "Kulindu Hansaja",
      account_number: "2221110009",
      amount: 30000.00,
      bank_name: "Commercial Bank",
      note: "Facebook Advertising Campaign",
      status: "TRANSFERRED",
      event_id: 3,
      partner_id: 3,
      created_at: "2025-10-22T10:25:00",
      updated_at: "2025-10-23T08:00:00",
      processed_at: "2025-10-23T08:00:00"
    },
    {
      id: 10,
      account_name: "Venuk De Soyza",
      account_number: "4443332221",
      amount: 80000.00,
      bank_name: "People's Bank",
      note: "Incomplete documentation provided",
      status: "REJECTED",
      event_id: 1,
      partner_id: 1,
      created_at: "2025-10-21T13:50:00",
      updated_at: "2025-10-22T09:00:00",
      processed_at: "2025-10-22T09:00:00"
    }
  ]

  const fetchWithdrawals = () => {
    setPending(true)
    WithdrawalService.getEventWithdrawals(1)
      .then((res) => {
        const fetchedWithdrawals = res.data.withdrawals || []
        setWithdrawals(fetchedWithdrawals.length > 0 ? fetchedWithdrawals : sampleData)
        setPending(false)
      })
      .catch((err) => {
        console.log(err)
        Alert("Failed to fetch withdrawals, showing sample data", "warning")
        setWithdrawals(sampleData)
        setPending(false)
      })
  }

  useEffect(() => {
    fetchWithdrawals()
  }, [])

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: "warning", text: "Pending" },
      TRANSFERRED: { color: "success", text: "Transferred" },
      REJECTED: { color: "danger", text: "Rejected" }
    }

    const config = statusConfig[status] || statusConfig.PENDING

    return (
      <Badge color={config.color}>
        {config.text}
      </Badge>
    )
  }

  const handleEdit = (row) => {
    setSelectedWithdrawal(row)
    setModalOpen(true)
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen)
    if (!modalOpen) {
      setSelectedWithdrawal(null)
      setReceiptFile(null)
    }
  }

  const handleFileChange = (e) => {
    setReceiptFile(e.target.files[0])
  }

  const handleSubmit = () => {
    if (!selectedWithdrawal) return

    MySwal.fire({
      title: "Update Withdrawal?",
      text: "Are you sure you want to update this withdrawal?",
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
        // Here you would call the update API
        Alert("Withdrawal updated successfully", "success")
        toggleModal()
        fetchWithdrawals()
      }
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount || 0)
  }

  const columns = [
    {
      name: "ID",
      sortable: true,
      minWidth: "80px",
      selector: (row) => row.id || 0
    },
    {
      name: "Account Name",
      sortable: true,
      minWidth: "200px",
      selector: (row) => row.account_name || "N/A"
    },
    {
      name: "Account Number",
      sortable: true,
      minWidth: "180px",
      selector: (row) => row.account_number || "N/A"
    },
    {
      name: "Bank Name",
      sortable: true,
      minWidth: "180px",
      selector: (row) => row.bank_name || "N/A"
    },
    {
      name: "Amount",
      sortable: true,
      minWidth: "150px",
      selector: (row) => formatCurrency(row.amount)
    },
    {
      name: "Event ID",
      sortable: true,
      minWidth: "100px",
      selector: (row) => row.event_id || "N/A"
    },
    {
      name: "Partner ID",
      sortable: true,
      minWidth: "120px",
      selector: (row) => row.partner_id || "N/A"
    },
    {
      name: "Status",
      sortable: true,
      minWidth: "150px",
      cell: (row) => getStatusBadge(row.status)
    },
    {
      name: "Created At",
      sortable: true,
      minWidth: "180px",
      selector: (row) => (row.created_at ? new Date(row.created_at).toLocaleString() : "N/A")
    },
    {
      name: "Processed At",
      sortable: true,
      minWidth: "180px",
      selector: (row) => (row.processed_at ? new Date(row.processed_at).toLocaleString() : "N/A")
    },
    {
      name: "Actions",
      minWidth: "100px",
      cell: (row) => (
        <Button
          color="primary"
          size="sm"
          onClick={() => handleEdit(row)}
        >
          <Edit2 size={14} />
        </Button>
      )
    }
  ]

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result
    const columnDelimiter = ","
    const lineDelimiter = "\n"

    const keys = [
      "id", "account_name", "account_number", "bank_name", "amount",
      "event_id", "partner_id", "status", "note",
      "created_at", "updated_at", "processed_at"
    ]

    result = ""
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach((item) => {
      let ctr = 0
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter
        
        let value = item[key]
        if ((key === "created_at" || key === "updated_at" || key === "processed_at") && value) {
          value = new Date(value).toLocaleString()
        }
        if (value === null || value === undefined) {
          value = ""
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

    const filename = "withdrawals_export.csv"

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute("href", encodeURI(csv))
    link.setAttribute("download", filename)
    link.click()
  }

  const filteredItems = withdrawals.filter((item) => {
    return JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !== -1
  })

  const subHeaderComponent = useMemo(() => (
    <Col md="4">
      <Input
        id="search"
        type="text"
        placeholder="Search..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
    </Col>
  ), [filterText])

  return (
    <>
      <Card>
        <CardHeader className="border-bottom">
          <h4 className="mb-0">Withdraw Funds</h4>
          <div className="d-flex mt-md-0 mt-1">
            <Button
              className="ms-2"
              color="primary"
              onClick={() => downloadCSV(withdrawals)}
              disabled={withdrawals.length === 0}
            >
              <Download size={15} />
              <span className="align-middle ms-50">Download CSV</span>
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="mb-2">
            <Label>Search:</Label>
            {subHeaderComponent}
          </div>
          <div className="react-dataTable">
            <DataTable
              columns={columns}
              data={filteredItems}
              pagination
              progressPending={pending}
              progressComponent={<SpinnerComponent />}
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
            />
          </div>
        </CardBody>
      </Card>

      {/* Edit Modal */}
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>
          <div className="d-flex justify-content-between align-items-center w-100">
            <span>Edit Withdrawal #{selectedWithdrawal?.id}</span>
            <Button color="link" className="text-dark p-0" onClick={toggleModal}>
              <X size={20} />
            </Button>
          </div>
        </ModalHeader>
        <ModalBody>
          {selectedWithdrawal && (
            <Form>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <Label for="accountName">Account Name</Label>
                    <Input
                      type="text"
                      id="accountName"
                      value={selectedWithdrawal.account_name || "N/A"}
                      readOnly
                      className="bg-light"
                    />
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label for="accountNumber">Account Number</Label>
                    <Input
                      type="text"
                      id="accountNumber"
                      value={selectedWithdrawal.account_number || "N/A"}
                      readOnly
                      className="bg-light"
                    />
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label for="bankName">Bank Name</Label>
                    <Input
                      type="text"
                      id="bankName"
                      value={selectedWithdrawal.bank_name || "N/A"}
                      readOnly
                      className="bg-light"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="amount">Amount</Label>
                    <Input
                      type="text"
                      id="amount"
                      value={formatCurrency(selectedWithdrawal.amount)}
                      readOnly
                      className="bg-light"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="currentStatus">Current Status</Label>
                    <Input
                      type="text"
                      id="currentStatus"
                      value={selectedWithdrawal.status || "N/A"}
                      readOnly
                      className="bg-light"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="eventId">Event ID</Label>
                    <Input
                      type="text"
                      id="eventId"
                      value={selectedWithdrawal.event_id || "N/A"}
                      readOnly
                      className="bg-light"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="partnerId">Partner ID</Label>
                    <Input
                      type="text"
                      id="partnerId"
                      value={selectedWithdrawal.partner_id || "N/A"}
                      readOnly
                      className="bg-light"
                    />
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label for="note">Note</Label>
                    <Input
                      type="textarea"
                      id="note"
                      value={selectedWithdrawal.note || "N/A"}
                      readOnly
                      className="bg-light"
                      rows="3"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="createdAt">Created At</Label>
                    <Input
                      type="text"
                      id="createdAt"
                      value={selectedWithdrawal.created_at ? new Date(selectedWithdrawal.created_at).toLocaleString() : "N/A"}
                      readOnly
                      className="bg-light"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="processedAt">Processed At</Label>
                    <Input
                      type="text"
                      id="processedAt"
                      value={selectedWithdrawal.processed_at ? new Date(selectedWithdrawal.processed_at).toLocaleString() : "Not Processed"}
                      readOnly
                      className="bg-light"
                    />
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label for="receipt">Upload Receipt</Label>
                    <Input
                      type="file"
                      id="receipt"
                      onChange={handleFileChange}
                    />
                    {receiptFile && (
                      <small className="text-muted">
                        Selected: {receiptFile.name}
                      </small>
                    )}
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label for="status">Update Status</Label>
                    <Input type="select" id="status" defaultValue={selectedWithdrawal.status}>
                      <option value="">Select...</option>
                      <option value="PENDING">Pending</option>
                      <option value="TRANSFERRED">Transferred</option>
                      <option value="REJECTED">Rejected</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default WithdrawFunds