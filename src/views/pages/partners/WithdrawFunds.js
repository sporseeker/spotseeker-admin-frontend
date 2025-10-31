import React, { useState, useEffect, useMemo, useRef } from 'react'
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
  DropdownToggle,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Form,
  FormGroup,
  Label
} from 'reactstrap'
import { Download, MoreVertical, Edit, Trash2, User, CreditCard, DollarSign, File, FileText, Percent } from 'react-feather'
import './partners.scss'
import CustomDataTable from "@components/data-table"
import SpinnerComponent from '../../../@core/components/spinner/Fallback-spinner'
import IconInput from '@components/icon-input'
import { dummyWithdrawFunds } from './constants'

// ** Actions Dropdown Component
const ActionsDropdown = ({ row, onEdit }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggle = () => setDropdownOpen(prevState => !prevState)

  const handleEdit = () => {
    console.log('Edit clicked for row:', row)
    if (onEdit) onEdit(row)
  }

  const handleDelete = () => {
    console.log('Delete clicked for row:', row)
    // Add delete logic here
  }

  return (
    <div style={{ width: '50px', display: 'flex', justifyContent: 'center' }}>
      <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="left">
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
        <DropdownMenu style={{ minWidth: '120px', width: '100%' }} direction="left">
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

const WithdrawFunds = () => {
  const [withdrawData, setWithdrawData] = useState([])
  const [pending, setPending] = useState(true)
  const [filterText, setFilterText] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedWithdraw, setSelectedWithdraw] = useState(null)
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    organizerName: '',
    bankName: '',
    amount: '',
    commissionPercent: 5,
    commissionAmount: '',
    totalAmount: '',
    note: '',
    receiptId: '',
    status: '',
    file: null
  })

  useEffect(() => {
    // Using dummy data
    setWithdrawData(dummyWithdrawFunds)
    setPending(false)
  }, [])

  function openSidebar(row) {
    setSelectedWithdraw(row)
    const amt = Number(row.amount) || 0
    const pct = 5
    const comm = +(amt * (pct / 100))
    const total = +(amt - comm)

    setForm({
      organizerName: row.organizerName || '',
      bankName: row.bankName || '',
      amount: amt,
      commissionPercent: pct,
      commissionAmount: comm,
      totalAmount: total,
      note: row.note || '',
      receiptId: row.receiptId || '',
      status: row.status || '',
      file: null
    })
    setIsSidebarOpen(true)
  }

  function closeSidebar() {
    setIsSidebarOpen(false)
    setSelectedWithdraw(null)
  }

  function handleFormChange(field, value) {
    // If amount changes, recalc commission and total based on commissionPercent
    if (field === 'amount') {
      const numeric = Number(value) || 0
      const pct = Number(form.commissionPercent) || 0
      const comm = +(numeric * (pct / 100))
      const total = +(numeric - comm)
      setForm(prev => ({ ...prev, amount: numeric, commissionAmount: comm, totalAmount: total }))
      return
    }

    setForm(prev => ({ ...prev, [field]: value }))
  }

  // helper to format currency values (no decimals for LKR-style display)
  function formatCurrency(value) {
    const n = Number(value)
    if (isNaN(n)) return ''
    return n.toLocaleString(undefined, { maximumFractionDigits: 0 })


  }


  // helper to truncate file names from middle with dynamic start and fixed end
  function truncateFileName(fileName, maxLength = 30) {
    if (!fileName || fileName.length <= maxLength) {
      return fileName
    }

    const lastDotIndex = fileName.lastIndexOf('.')
    if (lastDotIndex === -1) {
      // No extension, just truncate normally
      return fileName.length > maxLength ? `${fileName.substring(0, maxLength - 3)}...` : fileName
    }

    const extension = fileName.substring(lastDotIndex) // includes the dot
    const nameWithoutExt = fileName.substring(0, lastDotIndex)
    
    // Always show last 3 characters of filename + extension
    const endChars = 3
    const ellipsisLength = 3 // "..."
    
    // Calculate how many characters we can show at the start
    const availableForStart = maxLength - (endChars + extension.length + ellipsisLength)
    
    if (availableForStart <= 0) {
      // Not enough space, just show start of extension
      return `${fileName.substring(0, maxLength - 3)}...`
    }
    
    if (nameWithoutExt.length <= availableForStart + endChars) {
      return fileName 
    }
    
    const start = nameWithoutExt.substring(0, availableForStart)
    const end = nameWithoutExt.substring(nameWithoutExt.length - endChars)
    
    return `${start}...${end}${extension}`
  }

  function handleSave() {
    if (!selectedWithdraw) return
    setWithdrawData(prev => prev.map(w => (w.id === selectedWithdraw.id ? { ...w, organizerName: form.organizerName, bankName: form.bankName, note: form.note, receiptId: form.receiptId, status: form.status } : w)))
    closeSidebar()
  }

  const columns = [
    {
      name: "ID",
      minWidth: "100px",
      sortable: true,
      selector: (row) => row.id
    },
    {
      name: "Organizer NAME",
      minWidth: "180px",
      sortable: true,
      selector: (row) => row.organizerName
    },
    {
      name: "BANK NAME",
      minWidth: "150px",
      sortable: true,
      selector: (row) => row.bankName
    },
    {
      name: "AMOUNT",
      minWidth: "120px",
      sortable: true,
      selector: (row) => `$${row.amount.toLocaleString()}`
    },
    {
      name: "NOTE",
      minWidth: "200px",
      sortable: true,
      selector: (row) => row.note
    },
    {
      name: "STATUS",
      minWidth: "120px",
      sortable: true,
      cell: (row) => {
        let backgroundColor = '#82868B' // default secondary color
        let text = 'Unknown'

        switch (row.status) {
          case 'pending':
            backgroundColor = '#FF9F43' // warning/orange
            text = 'Pending'
            break
          case 'approved':
            backgroundColor = '#28C76F' // success/green
            text = 'Approved'
            break
          case 'rejected':
            backgroundColor = '#EA5455' // danger/red
            text = 'Rejected'
            break
          case 'completed':
            backgroundColor = '#00CFE8' // info/cyan
            text = 'Completed'
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
      name: "DATE & TIME",
      minWidth: "180px",
      sortable: true,
      selector: (row) => row.dateTime
    },
    {
      name: "RECEIPT ID",
      minWidth: "150px",
      sortable: true,
      selector: (row) => row.receiptId
    },
    {
      name: "",
      width: "50px",
      cell: (row) => <ActionsDropdown row={row} onEdit={openSidebar} />
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

    const filename = "withdraw-funds.csv"

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute("href", encodeURI(csv))
    link.setAttribute("download", filename)
    link.click()
  }

  const filteredItems = withdrawData.filter(
    item => JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !== -1
  )

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
            onClick={() => setFilterText('')}
          >
            Reset
          </Button>
        </div>
      </div>
    )
  }, [filterText])

  return (
    <>
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
          Withdraw Funds
        </CardTitle>

        <div className="d-flex">
          <Col lg="12" md="12">
            <Button
              className="ms-2"
              color="primary"
              style={{ height: '39px' }}
              onClick={() => downloadCSV(withdrawData)}>
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
          progressPending={pending}
          progressComponent={<SpinnerComponent />}
          subHeader
          subHeaderComponent={subHeaderComponent}
        />
      </CardBody>
    </Card>
    <Offcanvas isOpen={isSidebarOpen} toggle={closeSidebar} direction="end" style={{ width: '420px' }} className="partner-offcanvas">
      <OffcanvasHeader
        toggle={closeSidebar}
        style={{ height: '80px', backgroundColor: '#F2F2F2', display: 'flex', alignItems: 'center', padding: '0 16px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'Roboto Condensed, sans-serif', color: '#6A6775', fontSize: '20px', fontWeight: '500' }}>
            Edit Withdraw ID {selectedWithdraw ? `#${selectedWithdraw.id}` : ''}
          </div>
        </div>
      </OffcanvasHeader>
      <OffcanvasBody style={{ padding: '16px' }}>
        <Form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '20px' }}>
            <IconInput
              id="organizerName"
              name="organizerName"
              label="Organizer Name"
              value={form.organizerName}
              onChange={e => handleFormChange('organizerName', e.target.value)}
              icon={User}
            />
            <IconInput
              id="bankName"
              name="bankName"
              label="Bank Name"
              value={form.bankName}
              onChange={e => handleFormChange('bankName', e.target.value)}
              icon={CreditCard}
            />
            <IconInput
              id="amount"
              name="amount"
              label="Amount"
              type="number"
              step="1"
              value={form.amount}
              onChange={e => handleFormChange('amount', e.target.value)}
              icon={DollarSign}
            />
            <IconInput
              id="commission"
              name="commission"
              label={`Commissions (${form.commissionPercent}%)`}
              value={form.commissionAmount !== '' ? `- LKR ${formatCurrency(form.commissionAmount)}` : ''}
              readOnly
              icon={Percent}
            />
            <IconInput
              id="totalAmount"
              name="totalAmount"
              label="Total Withdraw Amount"
              value={form.totalAmount !== '' ? `LKR ${formatCurrency(form.totalAmount)}` : ''}
              readOnly
              icon={DollarSign}
            />
            <IconInput
              id="note"
              name="note"
              label="Note"
              value={form.note}
              onChange={e => handleFormChange('note', e.target.value)}
              icon={File}
            />
            <IconInput
              id="receiptId"
              name="receiptId"
              label="Transaction Receipt ID"
              value={form.receiptId}
              onChange={e => handleFormChange('receiptId', e.target.value)}
              icon={FileText}
            />
            <FormGroup style={{ marginBottom: 0 }}>
              <Label for="file" style={{ fontFamily: 'Roboto Condensed, sans-serif', color: '#6A6775', fontSize: '16px', fontWeight: '400' }}>Upload Receipt</Label>
              {/* Custom file picker: hidden native input + styled button + filename area */}
              <div className="custom-file-picker" style={{ marginTop: '6px' }}>
                <input
                  id="file"
                  ref={fileInputRef}
                  type="file"
                  className="hidden-file-input"
                  onChange={e => handleFormChange('file', e.target.files[0])}
                />
                <div
                  role="button"
                  tabIndex={0}
                  className="choose-file-btn"
                  onClick={() => {
                    if (fileInputRef.current) fileInputRef.current.click()
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      if (fileInputRef.current) fileInputRef.current.click()
                    }
                  }}
                >
                  Choose File
                </div>
                <div className="file-name" title={form.file ? form.file.name : ''}>
                  {form.file ? truncateFileName(form.file.name) : 'No file chosen'}
                </div>
              </div>
            </FormGroup>
            <FormGroup style={{ marginBottom: 0 }}>
              <Label for="status" style={{ fontFamily: 'Roboto Condensed, sans-serif', color: '#6A6775', fontSize: '16px', fontWeight: '400' }}>Status</Label>
              <Input type="select" id="status" name="status" value={form.status} onChange={e => handleFormChange('status', e.target.value)}>
                <option value="">Select....</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Input>
            </FormGroup>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '40px' }}>
            <Button color="danger" onClick={handleSave}>Submit</Button>
            <Button color="secondary" outline onClick={closeSidebar}>Cancel</Button>
          </div>
        </Form>
      </OffcanvasBody>
    </Offcanvas>
    </>
  )
}

export default WithdrawFunds