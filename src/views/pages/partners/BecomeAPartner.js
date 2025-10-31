import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Col,
  Button,
  Input,
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
import { useSearchParams } from "react-router-dom"
import './partners.scss'
// import EventService from "@services/EventService"
// import { Link } from "react-router-dom"
// import { getStatus } from "@utils"
import { Download, MoreVertical, Edit, Trash2, Mail, Phone, Eye, EyeOff } from "react-feather"
// import { Download, Mail } from "react-feather"
import SpinnerComponent from "../../../@core/components/spinner/Fallback-spinner"
// import { dummyEvents, dummyInvitations } from "./constants"
// import { dummyPartners } from "./constants"
import CustomDataTable from "@components/data-table"
import IconInput from '@components/icon-input'
import PartnershipAgreementsService from "@services/PartnershipAgreementsService"


const ActionsDropdown = ({ row, onEdit, isLastRow = false }) => {
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
      <Dropdown isOpen={dropdownOpen} toggle={toggle} direction={isLastRow ? "up" : "left"}>
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
  const [searchParams, setSearchParams] = useSearchParams()
  const [partnerData, setPartnerData] = useState([])
  const [pending, setPending] = useState(true)
  const [filterText, setFilterText] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState(null)

  // Get page from URL query parameter
  const urlPage = searchParams.get('page')
  const currentPageFromUrl = urlPage ? parseInt(urlPage) : 1
  
  // Get pageSize from URL or default to 10
  const urlPageSize = searchParams.get('limit')
  const defaultPageSize = urlPageSize ? parseInt(urlPageSize) : 10
  
  // Pagination state 
  const [currentPage, setCurrentPage] = useState(currentPageFromUrl - 1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [pageSize, setPageSize] = useState(defaultPageSize)

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

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Validation state
  const [validationErrors, setValidationErrors] = useState({})

  const fetchData = async (page = 0, limit = pageSize) => {
    try {
      setPending(true)
      const response = await PartnershipAgreementsService.getAllEventOrganizersRequests(page, limit)

      console.log("Fetched partner data:", response)
      const requestsArray = response.data.requests || response.data || []
      setPartnerData(requestsArray)
      setTotalRecords(response.data.total || 0)
      setPending(false)
    } catch (error) {
      console.error("Error fetching partner data:", error)
      setPending(false)
    }
  }

  // Fetch all data for CSV download
  const fetchAllData = async () => {
    try {
     
      const countResponse = await PartnershipAgreementsService.getAllEventOrganizersRequests(0, 1)
      const totalRecords = countResponse.data.total || 0
      
      if (totalRecords === 0) {
        return []
      }
      
      
      const response = await PartnershipAgreementsService.getAllEventOrganizersRequests(0, totalRecords)
      
      console.log("Fetched all partner data for CSV:", response)
      const allRequestsArray = response.data.requests || response.data || []
      return allRequestsArray
    } catch (error) {
      console.error("Error fetching all partner data:", error)
      return []
    }
  }

  useEffect(() => {
    fetchData(currentPage, pageSize)
  }, [currentPage, pageSize])

  // Handle URL query parameter changes
  useEffect(() => {
    const urlPage = searchParams.get('page')
    const urlLimit = searchParams.get('limit')
    
    const pageFromUrl = urlPage ? parseInt(urlPage) : 1
    const limitFromUrl = urlLimit ? parseInt(urlLimit) : 10
    
    const backendPage = pageFromUrl - 1
    
    // If URL parameters don't match current state, update state
    if (backendPage !== currentPage || limitFromUrl !== pageSize) {
      setCurrentPage(backendPage)
      setPageSize(limitFromUrl)
    }
  }, [searchParams, currentPage, pageSize])

  // Open sidebar with partner data
  function openSidebar(partner) {
    setSelectedPartner(partner)
    setForm({
      email: partner.email || "",
      phone: partner.mobile || "", 
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
    
    // Clear validation errors when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    if (field === 'password' && validationErrors.confirmPassword) {
      setValidationErrors(prev => ({ ...prev, confirmPassword: '' }))
    }
    
    if (field === 'confirmPassword' && validationErrors.password) {
      setValidationErrors(prev => ({ ...prev, password: '' }))
    }
  }

  // Validation function
  function validateForm() {
    const errors = {}
    
    // Password validation
    if (form.password && form.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long'
    }
    
    // Confirm password validation
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    if (!form.password && form.confirmPassword) {
      errors.password = 'Password is required'
    }
    
    if (form.password && !form.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleSave() {
    if (!selectedPartner) return

    if (!validateForm()) {
      return
    }

    setPartnerData(prev => prev.map(p => {
      if (p.id === selectedPartner.id) { 
        return {
          ...p,
          email: form.email,
          mobile: form.phone,  
          status: form.status
        }
      }
      return p
    }))

    
    closeSidebar()
  }

  let filteredItems = []
  if (Array.isArray(partnerData)) {
    // For server-side pagination, search on current page data only
    filteredItems = filterText ? partnerData.filter(item => JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !== -1) : partnerData
  }

  const columns = [
    {
      name: "ID",
      minWidth: "120px",
      sortable: true,
      selector: (row) => row.id || 'N/A'
    },
    {
      name: "Email",
      minWidth: "200px",
      sortable: true,
      selector: (row) => row.email || 'N/A'
    },
    {
      name: "Phone",
      minWidth: "150px",
      sortable: true,
      selector: (row) => row.mobile || 'N/A'
    },
    // {
    //   name: "Password",
    //   minWidth: "150px",
    //   sortable: true,
    //   selector: () => "••••••••" // Masked password
    // },
    {
      name: "Status",
      minWidth: "100px",
      sortable: true,
      cell: (row) => {
        let backgroundColor = '#82868B' 
        let text = 'Unknown'
        const status = (row.status || '').toUpperCase()

        switch (status) {
          case 'EMAIL_SUBMITTED':
            backgroundColor = '#00CFE8' 
            text = 'Email Submitted'
            break
          case 'MOBILE_SUBMITTED':
            backgroundColor = '#7367F0' 
            text = 'Mobile Submitted'
            break
          case 'OTP_VERIFIED':
            backgroundColor = '#28C76F'
            text = 'OTP Verified'
            break
          case 'PENDING_APPROVAL':
          case 'PENDING':
            backgroundColor = '#FF9F43' 
            text = 'Pending Approval'
            break
          case 'APPROVED':
            backgroundColor = '#28C76F' 
            text = 'Approved'
            break
          case 'REJECTED':
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
              width: '103px',
              backgroundColor,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              fontFamily: 'Roboto Condensed, sans-serif',
              fontSize: '13px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
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
      cell: (row, index) => <ActionsDropdown row={row} onEdit={openSidebar} isLastRow={index === filteredItems.length - 1} />
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
            onClick={() => {
              setFilterText('')
              fetchData(currentPage, pageSize)  // Refetch current page data
            }}
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
              onClick={async () => {
                const allData = await fetchAllData()
                downloadCSV(allData)
              }}>
              <Download size={18} style={{ color: window.innerWidth <= 576 ? '#EA5455' : '#FFFFFF' }} />
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
          data={filteredItems}  // Use filtered data for search functionality
          pagination
          paginationServer  // Enable server-side pagination
          paginationTotalRows={totalRecords}  
          paginationPerPage={pageSize}  
          paginationDefaultPage={currentPage + 1}  
          onChangePage={(page) => {
            const newPage = page - 1
            setCurrentPage(newPage)
            setFilterText('')  // Clear search when changing pages
           
            if (page === 1) {
              // Remove page parameter for first page
              const params = {}
              if (pageSize !== 10) params.limit = pageSize.toString()
              setSearchParams(params, { replace: true })
            } else {
              // Set page parameter for pages 2 and above
              const params = { page: page.toString() }
              if (pageSize !== 10) params.limit = pageSize.toString()
              setSearchParams(params)
            }
          }}
          onChangeRowsPerPage={(newPerPage) => {
            setPageSize(newPerPage)
            setCurrentPage(0) // Reset to first page
            setFilterText('') // Clear search
            
           
            const params = {}
            if (currentPageFromUrl > 1) {
              params.page = currentPageFromUrl.toString()
            }
            if (newPerPage !== 10) {
              params.limit = newPerPage.toString()
            }
            setSearchParams(params, { replace: true })
          }}
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
              Edit Partner {selectedPartner ? `#${selectedPartner.id}` : ''}  
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
              readOnly={true}
            />
            <IconInput
              id="phone"
              name="phone"
              label="Phone Number"
              value={form.phone}
              onChange={e => handleFormChange('phone', e.target.value)}
              icon={Phone}
              readOnly={true}
            />
            <IconInput
              id="password"
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={e => handleFormChange('password', e.target.value)}
              icon={showPassword ? EyeOff : Eye}
              onIconClick={() => setShowPassword(!showPassword)}
              error={validationErrors.password}
            />
            <IconInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={e => handleFormChange('confirmPassword', e.target.value)}
              icon={showConfirmPassword ? EyeOff : Eye}
              onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
              error={validationErrors.confirmPassword}
            />
            <FormGroup style={{ marginBottom: 0 }}>
              <Label for="status" style={{ fontFamily: 'Roboto Condensed, sans-serif', color: '#6A6775', fontSize: '16px', fontWeight: '400' }}>Status</Label>
              <Input 
                type="select" 
                id="status" 
                name="status" 
                value={form.status} 
                onChange={e => handleFormChange('status', e.target.value)}
                disabled={true}
                style={{
                  backgroundColor: '#fff'
                }}
              >
                <option value="EMAIL_SUBMITTED">Email Submitted</option>
                <option value="MOBILE_SUBMITTED">Mobile Submitted</option>
                <option value="OTP_VERIFIED">OTP Verified</option>
                <option value="PENDING_APPROVAL">Pending Approval</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </Input>
            </FormGroup>
            <FormGroup check style={{ marginBottom: 0 }}>
              <Label check style={{ fontFamily: 'Roboto Condensed, sans-serif', color: '#6A6775', fontSize: '16px', fontWeight: '400' }}>
                <Input type="checkbox" checked={form.sendEmail} onChange={e => handleFormChange('sendEmail', e.target.checked)} style={{ cursor: 'pointer' }} />{' '}
                Send Email
              </Label>
            </FormGroup>
            <FormGroup check style={{ marginBottom: 0 }}>
              <Label check style={{ fontFamily: 'Roboto Condensed, sans-serif', color: '#6A6775', fontSize: '16px', fontWeight: '400' }}>
                <Input type="checkbox" checked={form.sendWhatsApp} onChange={e => handleFormChange('sendWhatsApp', e.target.checked)} style={{ cursor: 'pointer' }} />{' '}
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