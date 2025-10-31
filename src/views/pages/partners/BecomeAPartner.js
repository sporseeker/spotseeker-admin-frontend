// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Col,
  Button,
  Row,
  CardDeck,
  Input,
  InputGroup,
  InputGroupText,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Form,
  FormGroup,
  Label
} from "reactstrap"
// import Select from "react-select"
import { useEffect, useMemo, useState } from "react"
import './partners.scss'
// import EventService from "@services/EventService"
// import { Link } from "react-router-dom"
// import { getStatus } from "@utils"
import { Download, MoreVertical, Edit, Trash2, Mail, Phone, Eye } from "react-feather"
// import { Download, Mail } from "react-feather"
import SpinnerComponent from "../../../@core/components/spinner/Fallback-spinner"
// import { dummyEvents, dummyInvitations } from "./constants"
import { dummyPartners } from "./constants"
import CustomDataTable from "@components/data-table"
import IconInput from '@components/icon-input'


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
        <DropdownMenu style={{ minWidth: '120px', width: '100%' }}>
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

const BecomeAPartner = () => {
  // const [events, setEvents] = useState([])
  const [partnerData, setPartnerData] = useState([])
  const [pending, setPending] = useState(true)
  const [filterText, setFilterText] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState(null)

  // Form state for sidebar
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    status: "",
    sendEmail: false,
    sendWhatsApp: false
  })

  useEffect(() => {
    // Using dummy data
    setPartnerData(dummyPartners)
    setPending(false)
  }, [])

  // Open sidebar with partner data
  function openSidebar(partner) {
    setSelectedPartner(partner)
    setForm({
      email: partner.email || "",
      phone: partner.phone || "",
      password: "",
      confirmPassword: "",
      status: partner.status || "",
      sendEmail: false,
      sendWhatsApp: false
    })
    setIsSidebarOpen(true)
  }

  function closeSidebar() {
    setIsSidebarOpen(false)
    setSelectedPartner(null)
  }

  function handleFormChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSave() {
    if (!selectedPartner) return

    setPartnerData(prev => prev.map(p => {
      if (p.orderId === selectedPartner.orderId) {
        return {
          ...p,
          email: form.email,
          phone: form.phone,
          status: form.status
        }
      }
      return p
    }))

    // In a real app you'd call an API here and optionally send email/whatsapp
    closeSidebar()
  }

  const columns = [
    {
      name: "ID",
      minWidth: "120px",
      sortable: true,
      selector: (row) => row.orderId
    },
    {
      name: "Email",
      minWidth: "200px",
      sortable: true,
      selector: (row) => row.email
    },
    {
      name: "Phone",
      minWidth: "150px",
      sortable: true,
      selector: (row) => row.phone
    },
    {
      name: "Password",
      minWidth: "150px",
      sortable: true,
      selector: () => "••••••••" // Masked password
    },
    {
      name: "Status",
      minWidth: "100px",
      sortable: true,
      cell: (row) => {
        let backgroundColor = '#82868B' 
        let text = 'Unknown'

        switch (row.status) {
          case 'pending':
            backgroundColor = '#FF9F43' 
            text = 'Pending'
            break
          case 'approved':
            backgroundColor = '#28C76F'
            text = 'Approved'
            break
          case 'rejected':
            backgroundColor = '#EA5455' 
            text = 'Rejected'
            break
          default:
            backgroundColor = '#82868B'
            text = row.status || 'Unknown'
        }

        return (
          <div
            style={{
              height: '28px',
              width: '68px',
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

        if (key === "password") {
          result += "••••••••" // Mask password in CSV
        } else {
          result += item[key] || ""
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

    const filename = "partners.csv"

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute("href", encodeURI(csv))
    link.setAttribute("download", filename)
    link.click()
  }

  const filteredItems = partnerData.filter(
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
          Become a Partner
        </CardTitle>

        <div className="d-flex">
          <Col lg="12" md="12">
            <Button
              className="ms-2"
              color="primary"
              style={{ height: '39px' }}
              onClick={() => downloadCSV(partnerData)}>
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

  <Offcanvas isOpen={isSidebarOpen} toggle={closeSidebar} direction="end" style={{ width: '400px' }} className="partner-offcanvas">
        <OffcanvasHeader
          toggle={closeSidebar}
          style={{
            height: '80px',
            backgroundColor: '#F2F2F2',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'Roboto Condensed, sans-serif', color: '#6A6775', fontSize: '20px', fontWeight: '500' }}>
              Edit Partner {selectedPartner ? `#${selectedPartner.orderId}` : ''}
            </div>
          </div>
        </OffcanvasHeader>
      <OffcanvasBody style={{ padding: '16px' }}>
        <Form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '20px' }}>
            <IconInput
              id="email"
              name="email"
              label="Email Address"
              value={form.email}
              onChange={e => handleFormChange('email', e.target.value)}
              icon={Mail}
            />
            <IconInput
              id="phone"
              name="phone"
              label="Phone Number"
              value={form.phone}
              onChange={e => handleFormChange('phone', e.target.value)}
              icon={Phone}
            />
            <IconInput
              id="password"
              name="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={e => handleFormChange('password', e.target.value)}
              icon={Eye}
            />
            <IconInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={e => handleFormChange('confirmPassword', e.target.value)}
              icon={Eye}
            />
            <FormGroup style={{ marginBottom: 0 }}>
              <Label for="status" style={{ fontFamily: 'Roboto Condensed, sans-serif', color: '#6A6775', fontSize: '16px', fontWeight: '400' }}>Status</Label>
              <Input type="select" id="status" name="status" value={form.status} onChange={e => handleFormChange('status', e.target.value)}>
                <option value="">Select....</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Input>
            </FormGroup>
            <FormGroup check style={{ marginBottom: 0 }}>
              <Label check style={{ fontFamily: 'Roboto Condensed, sans-serif', color: '#6A6775', fontSize: '16px', fontWeight: '400' }}>
                <Input type="checkbox" checked={form.sendEmail} onChange={e => handleFormChange('sendEmail', e.target.checked)} />{' '}
                Send Email
              </Label>
            </FormGroup>
            <FormGroup check style={{ marginBottom: 0 }}>
              <Label check style={{ fontFamily: 'Roboto Condensed, sans-serif', color: '#6A6775', fontSize: '16px', fontWeight: '400' }}>
                <Input type="checkbox" checked={form.sendWhatsApp} onChange={e => handleFormChange('sendWhatsApp', e.target.checked)} />{' '}
                Send WhatsApp
              </Label>
            </FormGroup>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <Button color="danger" onClick={handleSave}>Submit</Button>
            <Button color="secondary" outline onClick={closeSidebar}>Cancel</Button>
          </div>
        </Form>
      </OffcanvasBody>
    </Offcanvas>

    </>
  )
}
export default BecomeAPartner