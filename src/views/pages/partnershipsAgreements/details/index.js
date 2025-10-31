// ========================================
// FILE: src/views/pages/eventOrganizers/details/index.js
// ========================================

import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Button,
  Badge,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import EventOrganizerService from "@services/EventOrganizerService"
import { Alert } from "@alerts"
import SpinnerComponent from "../../../../@core/components/spinner/Fallback-spinner"
import { ArrowLeft, CheckCircle, XCircle, Clock, User, Briefcase, CreditCard, FileText, UserCheck } from "react-feather"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

const EventOrganizerDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [eventOrganizer, setEventOrganizer] = useState(null)
  const [activeTab, setActiveTab] = useState('1')

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const fetchEventOrganizer = () => {
    setLoading(true)
    EventOrganizerService.getAllEventOrganizers(0, 100)
      .then((res) => {
        const organizers = res.data.partners || []
        const found = organizers.find((org) => String(org.id) === String(id))
        if (found) {
          setEventOrganizer(found)
        } else {
          Alert("Event organizer not found", "error")
          navigate("/event-organizers/list")
        }
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        Alert(err.response?.data?.message || "Failed to fetch event organizer details", "error")
        setLoading(false)
        navigate("/event-organizers/list")
      })
  }

  useEffect(() => {
    if (id) {
      fetchEventOrganizer()
    }
  }, [id])

  const handleStatusChange = (newStatus) => {
    MySwal.fire({
      title: `Change status to ${newStatus}?`,
      text: "This will update the event organizer's status",
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
        EventOrganizerService.updateEventOrganizerStatus(id, newStatus)
          .then(() => {
            Alert("Event organizer status updated successfully", "success")
            fetchEventOrganizer()
          })
          .catch((err) => {
            Alert(err.response?.data?.message || "Failed to update status", "error")
          })
      }
    })
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      APPROVED: { color: "success", icon: <CheckCircle size={16} /> },
      PENDING: { color: "warning", icon: <Clock size={16} /> },
      REJECTED: { color: "danger", icon: <XCircle size={16} /> },
      SUSPENDED: { color: "secondary", icon: <XCircle size={16} /> }
    }

    const config = statusConfig[status] || statusConfig.PENDING

    return (
      <Badge color={config.color} className="d-flex align-items-center gap-50" style={{ width: "fit-content" }}>
        {config.icon}
        <span>{status}</span>
      </Badge>
    )
  }

  if (loading) {
    return <SpinnerComponent />
  }

  if (!eventOrganizer) {
    return null
  }

  // Dummy data for missing fields
  const organizerData = {
    ...eventOrganizer,
    // Basic Details
    firstName: eventOrganizer.firstName || "John",
    lastName: eventOrganizer.lastName || "Doe",
    displayName: eventOrganizer.displayName || "John Doe Events",
    address: eventOrganizer.address || "123 Event Street, City Center",
    city: eventOrganizer.city || "Colombo",
    country: eventOrganizer.country || "Sri Lanka",
    postalCode: eventOrganizer.postalCode || "00100",
    
    // Company Details
    companyName: eventOrganizer.companyName || "Event Masters Pvt Ltd",
    businessRegNo: eventOrganizer.businessRegNo || "PV00123456",
    taxId: eventOrganizer.taxId || "123-456-789",
    companyAddress: eventOrganizer.companyAddress || "456 Business Road, Corporate Tower",
    companyCity: eventOrganizer.companyCity || "Colombo",
    companyCountry: eventOrganizer.companyCountry || "Sri Lanka",
    companyEmail: eventOrganizer.companyEmail || "info@eventmasters.lk",
    companyInstagram: eventOrganizer.companyInstagram || "https://www.instagram.com/eventmasters",
    companyFacebook: eventOrganizer.companyFacebook || "https://www.facebook.com/eventmasters.events123",
    
    // Bank Details
    bankName: eventOrganizer.bankName || "Commercial Bank",
    accountNumber: eventOrganizer.accountNumber || "1234567890",
    accountHolderName: eventOrganizer.accountHolderName || "John Doe",
    branchCode: eventOrganizer.branchCode || "001",
    swiftCode: eventOrganizer.swiftCode || "CCEYLKLX",
    
    // Agreement
    agreementSigned: eventOrganizer.agreementSigned !== undefined ? eventOrganizer.agreementSigned : true,
    agreementDate: eventOrganizer.agreementDate || new Date().toISOString(),
    
    // Access Level
    permissions: eventOrganizer.permissions || ["CREATE_EVENTS", "MANAGE_TICKETS", "VIEW_REPORTS"]
  }

  return (
    <>
      <Card>
        <CardHeader className="border-bottom bg-light-primary">
          <div className="d-flex justify-content-between align-items-center w-100">
            <CardTitle tag="h4" className="mb-0">Event Organizer Details</CardTitle>
            <Button
              color="secondary"
              size="sm"
              onClick={() => navigate("/event-organizers/list")}
            >
              <ArrowLeft size={14} />
              <span className="align-middle ms-50">Back to List</span>
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md="3" sm="12">
              <Nav className="nav-left" pills vertical>
                <NavItem>
                  <NavLink
                    active={activeTab === '1'}
                    onClick={() => toggle('1')}
                    style={{ cursor: 'pointer' }}
                  >
                    <User size={18} />
                    <span className="fw-bold ms-50">Basic Details</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={activeTab === '2'}
                    onClick={() => toggle('2')}
                    style={{ cursor: 'pointer' }}
                  >
                    <Briefcase size={18} />
                    <span className="fw-bold ms-50">Company Details</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={activeTab === '3'}
                    onClick={() => toggle('3')}
                    style={{ cursor: 'pointer' }}
                  >
                    <User size={18} />
                    <span className="fw-bold ms-50">Organizer Details</span>
                  </NavLink>
                </NavItem>
              </Nav>
            </Col>
            
            <Col md="9" sm="12">
              <TabContent activeTab={activeTab}>
                {/* Tab 1: Basic Details */}
                <TabPane tabId="1">
                  <h4 className="mb-3">Basic Details</h4>
                  <Form>
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <Label for="email">Email Address</Label>
                          <Input
                            type="email"
                            id="email"
                            value={organizerData.email}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label for="mobile">Phone Number</Label>
                          <Input
                            type="text"
                            id="mobile"
                            value={organizerData.mobile}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label for="firstName">First Name</Label>
                          <Input
                            type="text"
                            id="firstName"
                            value={organizerData.firstName}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label for="lastName">Last Name</Label>
                          <Input
                            type="text"
                            id="lastName"
                            value={organizerData.lastName}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup>
                          <Label for="displayName">Display Name</Label>
                          <Input
                            type="text"
                            id="displayName"
                            value={organizerData.displayName}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup>
                          <Label for="address">Address</Label>
                          <Input
                            type="text"
                            id="address"
                            value={organizerData.address}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label for="city">City</Label>
                          <Input
                            type="text"
                            id="city"
                            value={organizerData.city}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label for="country">Country</Label>
                          <Input
                            type="text"
                            id="country"
                            value={organizerData.country}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label for="postalCode">Postal Code</Label>
                          <Input
                            type="text"
                            id="postalCode"
                            value={organizerData.postalCode}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Mobile Verified</Label>
                          <div>
                            <Badge color={organizerData.mobileVerified ? "success" : "danger"}>
                              {organizerData.mobileVerified ? "Verified" : "Not Verified"}
                            </Badge>
                          </div>
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Profile Complete</Label>
                          <div>
                            <Badge color={organizerData.profileComplete ? "success" : "warning"}>
                              {organizerData.profileComplete ? "Complete" : "Incomplete"}
                            </Badge>
                          </div>
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup>
                          <Label>Status</Label>
                          <div>{getStatusBadge(organizerData.status)}</div>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </TabPane>

                {/* Tab 2: Company Details */}
                <TabPane tabId="2">
                  <h4 className="mb-3">Company Details</h4>
                  <Form>
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <Label for="companyName">Organization Name</Label>
                          <Input
                            type="text"
                            id="companyName"
                            value={organizerData.companyName}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label for="businessRegNo">Business Registration (BR)</Label>
                          <Input
                            type="text"
                            id="businessRegNo"
                            value={organizerData.businessRegNo}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label for="taxId">Tax ID</Label>
                          <Input
                            type="text"
                            id="taxId"
                            value={organizerData.taxId}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup>
                          <Label for="companyAddress">Registered Company Address</Label>
                          <Input
                            type="textarea"
                            id="companyAddress"
                            value={organizerData.companyAddress}
                            readOnly
                            className="bg-light"
                            rows="2"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label for="companyCity">City</Label>
                          <Input
                            type="text"
                            id="companyCity"
                            value={organizerData.companyCity}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label for="companyCountry">Country</Label>
                          <Input
                            type="text"
                            id="companyCountry"
                            value={organizerData.companyCountry}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup>
                          <Label for="companyEmail">Business Email Address</Label>
                          <Input
                            type="email"
                            id="companyEmail"
                            value={organizerData.companyEmail}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label for="companyInstagram">Company Instagram Page Link</Label>
                          <Input
                            type="text"
                            id="companyInstagram"
                            value={organizerData.companyInstagram}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label for="companyFacebook">Company Facebook Page Link</Label>
                          <Input
                            type="text"
                            id="companyFacebook"
                            value={organizerData.companyFacebook}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="12" className="mt-2">
                        <h5>Bank Details</h5>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label for="bankName">Bank Name</Label>
                          <Input
                            type="text"
                            id="bankName"
                            value={organizerData.bankName}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label for="branchCode">Branch Code</Label>
                          <Input
                            type="text"
                            id="branchCode"
                            value={organizerData.branchCode}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label for="accountNumber">Account Number</Label>
                          <Input
                            type="text"
                            id="accountNumber"
                            value={organizerData.accountNumber}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label for="accountHolderName">Account Holder Name</Label>
                          <Input
                            type="text"
                            id="accountHolderName"
                            value={organizerData.accountHolderName}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label for="swiftCode">SWIFT/BIC Code</Label>
                          <Input
                            type="text"
                            id="swiftCode"
                            value={organizerData.swiftCode}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </TabPane>

                {/* Tab 3: Organizer Details */}
                <TabPane tabId="3">
                  <h4 className="mb-3">Organizer Details</h4>
                  <Form>
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <Label>User Type</Label>
                          <div>
                            <Badge color={organizerData.userType === "ADMIN" ? "primary" : "info"} className="p-75">
                              {organizerData.userType}
                            </Badge>
                          </div>
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup>
                          <Label>Current Status</Label>
                          <div>{getStatusBadge(organizerData.status)}</div>
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Created At</Label>
                          <Input
                            type="text"
                            value={new Date(organizerData.createdAt).toLocaleString()}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup>
                          <Label>Updated At</Label>
                          <Input
                            type="text"
                            value={new Date(organizerData.updatedAt).toLocaleString()}
                            readOnly
                            className="bg-light"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="12" className="mt-2">
                        <h5>Permissions</h5>
                        <div className="d-flex flex-wrap gap-50">
                          {organizerData.permissions.map((permission, index) => (
                            <Badge key={index} color="light-primary" className="p-75">
                              {permission.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </Col>
                      <Col md="12" className="mt-3">
                        <h5>Status Management</h5>
                        <div className="d-flex gap-1 flex-wrap mt-1">
                          <Button
                            color="success"
                            onClick={() => handleStatusChange("APPROVED")}
                            disabled={organizerData.status === "APPROVED"}
                            size="sm"
                          >
                            <CheckCircle size={14} />
                            <span className="align-middle ms-50">Approve</span>
                          </Button>
                          <Button
                            color="danger"
                            onClick={() => handleStatusChange("REJECTED")}
                            disabled={organizerData.status === "REJECTED"}
                            size="sm"
                          >
                            <XCircle size={14} />
                            <span className="align-middle ms-50">Reject</span>
                          </Button>
                          <Button
                            color="warning"
                            onClick={() => handleStatusChange("SUSPENDED")}
                            disabled={organizerData.status === "SUSPENDED"}
                            size="sm"
                          >
                            <XCircle size={14} />
                            <span className="align-middle ms-50">Suspend</span>
                          </Button>
                          <Button
                            color="secondary"
                            onClick={() => handleStatusChange("PENDING")}
                            disabled={organizerData.status === "PENDING"}
                            size="sm"
                          >
                            <Clock size={14} />
                            <span className="align-middle ms-50">Set Pending</span>
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </TabPane>
              </TabContent>

              {/* Navigation Buttons */}
              <Row className="mt-4 pt-2 border-top">
                <Col className="d-flex justify-content-between">
                  <Button
                    color="secondary"
                    outline
                    onClick={() => {
                      const prevTab = String(Math.max(1, parseInt(activeTab) - 1))
                      setActiveTab(prevTab)
                    }}
                    disabled={activeTab === '1'}
                  >
                    <ArrowLeft size={14} />
                    <span className="align-middle ms-50">Previous</span>
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      if (activeTab === '3') {
                        navigate("/event-organizers/list")
                      } else {
                        const nextTab = String(Math.min(3, parseInt(activeTab) + 1))
                        setActiveTab(nextTab)
                      }
                    }}
                  >
                    <span className="align-middle me-50">{activeTab === '3' ? 'Back to List' : 'Next'}</span>
                    {activeTab === '3' ? <ArrowLeft size={14} /> : <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  )
}

export default EventOrganizerDetails