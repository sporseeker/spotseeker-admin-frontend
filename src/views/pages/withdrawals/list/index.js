// ========================================
// FILE: src/views/pages/withdrawals/list/index.js
// ========================================

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

  // Sample data for testing
  const sampleData = [
    {
      id: 13565,
      organizerName: "Oneli Weerasooriya",
      bankName: "Bank of Ceylon",
      amount: "100,000",
      note: "Staff Payment",
      status: "PENDING",
      accountNumber: "1234567890",
      accountName: "Oneli Weerasooriya",
      commission: "5,000",
      totalWithdrawAmount: "95,000",
      transactionReceiptId: "",
      createdAt: "2025-10-30T10:30:00"
    },
    {
      id: 13566,
      organizerName: "Dilakshan Surendra",
      bankName: "Commercial",
      amount: "250,000",
      note: "Venue Booking",
      status: "PENDING",
      accountNumber: "9876543210",
      accountName: "Dilakshan Surendra",
      commission: "12,500",
      totalWithdrawAmount: "237,500",
      transactionReceiptId: "",
      createdAt: "2025-10-29T15:20:00"
    },
    {
      id: 13567,
      organizerName: "Bhanuka Eranga",
      bankName: "People's Bank",
      amount: "300,000",
      note: "Catering Service",
      status: "PENDING",
      accountNumber: "5554443322",
      accountName: "Bhanuka Eranga",
      commission: "15,000",
      totalWithdrawAmount: "285,000",
      transactionReceiptId: "",
      createdAt: "2025-10-28T08:15:00"
    },
    {
      id: 13568,
      organizerName: "Minal Sasnuka",
      bankName: "Bank of Ceylon",
      amount: "40,000",
      note: "Printing Tickets",
      status: "APPROVED",
      accountNumber: "1112223334",
      accountName: "Minal Sasnuka",
      commission: "2,000",
      totalWithdrawAmount: "38,000",
      transactionReceiptId: "TRX001",
      createdAt: "2025-10-27T12:45:00"
    },
    {
      id: 13569,
      organizerName: "Kalana Dheemantha",
      bankName: "Bank of Ceylon",
      amount: "80,000",
      note: "License & Permits",
      status: "APPROVED",
      accountNumber: "7778889990",
      accountName: "Kalana Dheemantha",
      commission: "4,000",
      totalWithdrawAmount: "76,000",
      transactionReceiptId: "TRX002",
      createdAt: "2025-10-26T09:30:00"
    },
    {
      id: 13570,
      organizerName: "Theekshana Chamin",
      bankName: "Commercial",
      amount: "190,000",
      note: "Security Services",
      status: "APPROVED",
      accountNumber: "3332221110",
      accountName: "Theekshana Chamin",
      commission: "9,500",
      totalWithdrawAmount: "180,500",
      transactionReceiptId: "TRX003",
      createdAt: "2025-10-25T14:20:00"
    },
    {
      id: 13571,
      organizerName: "Leyana Dabare",
      bankName: "People's Bank",
      amount: "220,000",
      note: "Staff Payment",
      status: "APPROVED",
      accountNumber: "6665554443",
      accountName: "Leyana Dabare",
      commission: "11,000",
      totalWithdrawAmount: "209,000",
      transactionReceiptId: "TRX004",
      createdAt: "2025-10-24T11:15:00"
    },
    {
      id: 13572,
      organizerName: "Javen Dimithri",
      bankName: "Bank of Ceylon",
      amount: "150,000",
      note: "Sound & Lighting",
      status: "APPROVED",
      accountNumber: "8889990001",
      accountName: "Javen Dimithri",
      commission: "7,500",
      totalWithdrawAmount: "142,500",
      transactionReceiptId: "TRX005",
      createdAt: "2025-10-23T16:40:00"
    },
    {
      id: 13573,
      organizerName: "Kulindu Hansaja",
      bankName: "Commercial",
      amount: "30,000",
      note: "Facebook Ads",
      status: "APPROVED",
      accountNumber: "2221110009",
      accountName: "Kulindu Hansaja",
      commission: "1,500",
      totalWithdrawAmount: "28,500",
      transactionReceiptId: "TRX006",
      createdAt: "2025-10-22T10:25:00"
    },
    {
      id: 13574,
      organizerName: "Venuk De Soyza",
      bankName: "People's Bank",
      amount: "80,000",
      note: "Staff Payment",
      status: "REJECTED",
      accountNumber: "4443332221",
      accountName: "Venuk De Soyza",
      commission: "4,000",
      totalWithdrawAmount: "76,000",
      transactionReceiptId: "",
      createdAt: "2025-10-21T13:50:00"
    }
  ]

  const fetchWithdrawals = () => {
    setPending(true)
    // Assuming eventId = 1 for now, you can make this dynamic
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
      APPROVED: { color: "success", text: "Approved" },
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

  const columns = [
    {
      name: "ID",
      sortable: true,
      minWidth: "100px",
      selector: (row) => row.id
    },
    {
      name: "ORGANIZER NAME",
      sortable: true,
      minWidth: "200px",
      selector: (row) => row.organizerName
    },
    {
      name: "BANK NAME",
      sortable: true,
      minWidth: "180px",
      selector: (row) => row.bankName
    },
    {
      name: "AMOUNT",
      sortable: true,
      minWidth: "150px",
      selector: (row) => `LKR ${row.amount}`
    },
    {
      name: "NOTE",
      sortable: true,
      minWidth: "180px",
      selector: (row) => row.note
    },
    {
      name: "STATUS",
      sortable: true,
      minWidth: "150px",
      cell: (row) => getStatusBadge(row.status)
    },
    {
      name: "ACTIONS",
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

    const keys = ["id", "organizerName", "bankName", "amount", "note", "status", "createdAt"]

    result = ""
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach((item) => {
      let ctr = 0
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter
        
        let value = item[key]
        if (key === "createdAt" && value) {
          value = new Date(value).toLocaleString()
        }
        if (value === null || value === undefined) {
          value = "N/A"
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
              color="secondary"
              outline
              onClick={() => downloadCSV(withdrawals)}
              disabled={withdrawals.length === 0}
            >
              Reset
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
            <span>Edit Withdraw #{selectedWithdrawal?.id}</span>
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
                    <Label for="organizerName">Organizer Name</Label>
                    <Input
                      type="text"
                      id="organizerName"
                      value={selectedWithdrawal.organizerName}
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
                      value={selectedWithdrawal.bankName}
                      readOnly
                      className="bg-light"
                    />
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label for="amount">Amount</Label>
                    <Input
                      type="text"
                      id="amount"
                      value={`LKR ${selectedWithdrawal.amount}`}
                      readOnly
                      className="bg-light"
                    />
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label for="commission">Commissions (5%)</Label>
                    <Input
                      type="text"
                      id="commission"
                      value={`LKR ${selectedWithdrawal.commission}`}
                      readOnly
                      className="bg-light"
                    />
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label for="totalAmount">Total Withdraw Amount</Label>
                    <Input
                      type="text"
                      id="totalAmount"
                      value={`LKR ${selectedWithdrawal.totalWithdrawAmount}`}
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
                      value={selectedWithdrawal.note}
                      readOnly
                      className="bg-light"
                      rows="3"
                    />
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label for="transactionId">Transaction Receipt ID</Label>
                    <Input
                      type="text"
                      id="transactionId"
                      value={selectedWithdrawal.transactionReceiptId}
                      placeholder="Enter transaction receipt ID"
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
                    <Label for="status">Status</Label>
                    <Input type="select" id="status" defaultValue={selectedWithdrawal.status}>
                      <option value="">Select...</option>
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
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