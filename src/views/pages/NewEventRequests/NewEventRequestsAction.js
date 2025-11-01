
import { Button } from 'reactstrap'
import { useImmer } from 'use-immer'
import Wizard from "@components/wizard"
import { useRef, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { EditorState, ContentState, convertFromHTML } from 'draft-js'
import { convertToHTML } from 'draft-convert'
import BasicDetails from './NewEventRequestsActionSteps/BasicDetails'
import PackageDetails from './NewEventRequestsActionSteps/PackageDetails'
import PromotionDetails from './NewEventRequestsActionSteps/PromotionDetails'
import Settings from './NewEventRequestsActionSteps/Settings'
import Features from './NewEventRequestsActionSteps/Features'
import PaymentGateway from './NewEventRequestsActionSteps/PaymentGateway'
import AnalyticsSettings from './NewEventRequestsActionSteps/AnalyticsSettings'
import EventService from '../../../services/EventService'

const NewEventRequests = () => {
    const ref = useRef(null)
    const location = useLocation()
    
    // Get event data if passed from another page 
    const { eventData, isEdit } = location.state || {}
    
    // Editor state for description
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    
    const [pgs] = useState([
  {
    id: 1,
    name: "Visa / Master",
    commission_rate: 2.9,
    apply_handling_fee: true
  },
  {
    id: 2,
    name: "KoKo (Buy Now Pay Later)",
    commission_rate: 2.9,
    apply_handling_fee: true
  }

]

)


const [stepper, setStepper] = useState(null)
  const [productData, setProductData] = useImmer({
    id: "",
    name: "",
    description: "",
    organizer: "",
    manager: "",
    start_date: "",
    end_date: "",
    type: "",
    sub_type: "",
    featured: false,
    free_seating: true,
    venue: "",
    status: "pending",
    enable_event: false,
    description_enabled: false,
    start_date_enabled: false,
    end_date_enabled: false,
    organization_enabled: false,
    organizer_enabled: false,
    invoice: [
      {
        packageName: "",
        packageDesc: "",
        packagePrice: "",
        packageQty: "",
        packageAvailQty: "",
        packageResQty: "",
        packageAllocSeats: "",
        packageAvailSeats: "",
        packageFreeSeating: true,
        sold_out: false,
        promotions: false,
        promotion: [
          {
            promoCode: "",
            discAmount: "",
            discAmtIsPercentage: true,
            isPerTicket: false,
            minTickets: "",
            minAmount: "",
            maxTickets: "",
            maxAmount: "",
            startDateTime: "",
            endDateTime: "",
            isAutoApply: false,
            redeems: ""
          }
        ],
        active: true,
        deleted: false,
        maxBuyTickets: 0
      }
    ],
    banner_img: "",
    thumbnail_img: "",
    sold_out_msg: "",
    handling_cost: "",
    handling_cost_perc: false,
    ftype: "create",
    currency: "LKR",
    invitation_feature: false,
    invitation_count: "",
    invitation_packages: [
      {
        packageName: "",
        packageDesc: "",
        packageQty: "",
        packageAvailQty: "",
        packageSoldQty: "",
        packageAllocSeats: "",
        active: true,
        deleted: false,
        packageFreeSeating: true
      }
    ],
    addons_feature: false,
    addons: [
      {
        addonName: "",
        addonImage: "",
        addonCategory: "",
        addonPrice: "",
        deleted: false
      }
    ],
    trailer_url: "",
    payment_gateways: [
      {
        id: "",
        name: "",
        commission_rate: 0,
        apply_handling_fee: true,
        deleted: false
      }
    ],
    analytics_ids: []
  })

  // Auto-fill form data when editing
  useEffect(() => {
    if (isEdit && eventData) {
      setProductData((draft) => {
        // Basic Details
        draft.id = eventData.id || ""
        draft.name = eventData.name || ""
        draft.description = eventData.description || ""
        draft.organizer = eventData.organizer || ""
        draft.organizer_name = eventData.organizer || ""
        draft.manager = eventData.manager || ""
        draft.start_date = eventData.startDate || ""
        draft.end_date = eventData.endDate || ""
        draft.type = eventData.type || ""
        draft.sub_type = eventData.subType || ""
        draft.event_type = eventData.type || ""
        draft.event_category = eventData.subType || ""
        draft.featured = eventData.featured || false
        draft.free_seating = eventData.freeSeating !== undefined ? eventData.freeSeating : true
        draft.venue = eventData.venueId || ""
        draft.status = eventData.status || "pending"
        
        draft.banner_img = eventData.bannerImg || ""
        draft.thumbnail_img = eventData.thumbnailImg || ""
        draft.trailer_url = eventData.trailerUrl || ""
      
        draft.handling_cost = eventData.handlingCost || ""
        draft.handling_cost_perc = eventData.handlingCostPerc || false
        draft.currency = eventData.currency || "LKR"
    
        draft.invitation_feature = eventData.invitationFeature || false
        draft.invitation_count = eventData.invitationCount || ""
        draft.addons_feature = eventData.addonsFeature || false
        
        // Partner/Organization
        if (eventData.partner) {
          draft.organization_name = eventData.partner.organizationName || ""
        }
        
        // Set as edit mode
        draft.ftype = "edit"
      })
      
      // Convert description HTML string to EditorState
      if (eventData.description) {
        try {
          const blocksFromHTML = convertFromHTML(eventData.description)
          const contentState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
          )
          setEditorState(EditorState.createWithContent(contentState))
        } catch (error) {
          console.error('Error converting description to EditorState:', error)
          setEditorState(EditorState.createEmpty())
        }
      }
    }
  }, [isEdit, eventData, setProductData])

  // Add missing handler functions
  const handleChange = (e, index, type) => {
    const { name, value } = e.target
    setProductData((draft) => {
      if (type === "inv") {
        // Handle invitation package fields
        draft.invitation_packages[index][name] = value
      } else {
        // Handle regular fields
        draft[name] = value
      }
    })
  }

  const handleDropdownChange = (selected, action, index, type) => {
    const name = action.name
    setProductData((draft) => {
      if (type === "inv") {
        // Handle invitation package dropdown fields
        draft.invitation_packages[index][name] = selected.value
      } else {
        // Handle regular dropdown fields
        draft[name] = selected.value
      }
    })
  }

  const handleStartDateChange = (dateStr) => {
    setProductData((draft) => {
      draft.start_date = dateStr
    })
  }

  const handleEndDateChange = (dateStr) => {
    setProductData((draft) => {
      draft.end_date = dateStr
    })
  }

  const handleEditor = (state) => {
    setEditorState(state)
    // Convert EditorState to HTML and save to productData
    const html = convertToHTML(state.getCurrentContent())
    setProductData((draft) => {
      draft.description = html
    })
  }
  
  const handleEditorChange = (content) => {
    setProductData((draft) => {
      draft.description = content
    })
  }


    const handlePromotionStatus = (index, value, type) => {
    if (index !== null) {
      setProductData((product) => {
        product.invoice[index][type] = value
      })
    } else {
      setProductData((product) => {
        product[type] = value
      })
    }
  }


   const handleAnalyticsChange = (analytics) => {
    setProductData((product) => ({
      ...product,
      analytics_ids: analytics
    }))
  }

  // Invitation Package Handlers
  const handleInvitationPackageAdd = (index) => {
    setProductData((draft) => {
      if (index !== null && index !== undefined) {
        draft.invitation_packages[index].deleted = false
      } else {
        draft.invitation_packages.push({
          packageName: "",
          packageDesc: "",
          packageQty: "",
          packageAvailQty: "",
          packageSoldQty: "",
          packageAllocSeats: "",
          active: true,
          deleted: false,
          packageFreeSeating: true
        })
      }
    })
  }

  const handleInvitationPackageRemove = (index) => {
    setProductData((draft) => {
      draft.invitation_packages[index].deleted = true
    })
  }

  // Addon Handlers
  const handleAddonAdd = (index) => {
    setProductData((draft) => {
      if (index !== null && index !== undefined) {
        draft.addons[index].deleted = false
      } else {
        draft.addons.push({
          addonName: "",
          addonImage: "",
          addonCategory: "",
          addonPrice: "",
          deleted: false
        })
      }
    })
  }

  const handleAddonRemove = (index) => {
    setProductData((draft) => {
      draft.addons[index].deleted = true
    })
  }

  const handleAddonInputChange = (e, index, type, option) => {
    setProductData((draft) => {
      if (type === "input") {
        const { name, value } = e.target
        draft.addons[index][name] = value
      } else if (type === "select") {
        draft.addons[index].addonCategory = option.value
      } else if (type === "file") {
        // Handle file upload - for now just store the file name
        if (e.target.files && e.target.files[0]) {
          draft.addons[index].addonImage = e.target.files[0].name
        }
      }
    })
  }

const steps = [
    {
      id: "basic-details",
      title: "Basic Details",
      content: (
        <BasicDetails
          stepper={stepper}
          type="wizard-vertical"
          handleStartDateChange={handleStartDateChange}
          handleEndDateChange={handleEndDateChange}
          handleChange={handleChange}
          handleDropdownChange={handleDropdownChange}
          productData={productData}
          handleEditor={handleEditor}
          handleEditorChange={handleEditorChange}
          editorValue={editorState}
        />
      )
    },
    {
      id: "package-details",
      title: "Packages",
      content: (
        <PackageDetails
          stepper={stepper}
          type="wizard-vertical"
        //   handleChange={handleChange}
        //   submitHandler={submitHandler}
        //   handleFileChange={handleFileChange}
        //   handlePackageAdd={handlePackageAdd}
        //   handlePackageRemove={handlePackageRemove}
          productData={productData}
        //   handleDropdownChange={handlePackageFreeSeatingChange}
        //   handlePackageActiveChange={handlePackageActiveChange}
        />
      )
    },
    {
      id: "promo-details",
      title: "Promotions",
      content: (
        <PromotionDetails
          stepper={stepper}
          type="wizard-vertical"
        //   handlePromoChange={handlePromoChange}
        //   handlePromoDropdownChange={handlePromoDropdownChange}
        //   submitHandler={submitHandler}
        //   handleFileChange={handleFileChange}
        //   handlePackageAdd={handlePackageAdd}
        //   handlePackageRemove={handlePackageRemove}
          productData={productData}
        //   handleDropdownChange={handlePackageFreeSeatingChange}
        //   handlePromotionStatus={handlePromotionStatus}
        //   handlePromoStartDate={handlePromoStartDate}
        //   handlePromoEndDate={handlePromoEndDate}
        />
      )
    },
    {
      id: "settings-details",
      title: "Settings",
      content: (
        <Settings
          stepper={stepper}
          type="wizard-vertical"
        //   handleChange={handleChange}
          productData={productData}
        //   handlePromotionStatus={handlePromotionStatus}
        />
      )
    },
    {
      id: "features-details",
      title: "Features",
      content: (
        <Features
          stepper={stepper}
          type="wizard-vertical"
          handleChange={handleChange}
          productData={productData}
          handleInvitationPackageAdd={handleInvitationPackageAdd}
          handleInvitationPackageRemove={handleInvitationPackageRemove}
          handlePromotionStatus={handlePromotionStatus}
          handleDropdownChange={handleDropdownChange}
          handleAddonAdd={handleAddonAdd}
          handleAddonRemove={handleAddonRemove}
          handleAddonInputChange={handleAddonInputChange}
        />
      )
    },
    {
      id: "payment-details",
      title: "Payment Methods",
      content: (
        <PaymentGateway
          stepper={stepper}
          type="wizard-vertical"
          // handleChange={handleChange}
          productData={productData}
          // handlePromotionStatus={handlePromotionStatus}
          // handlePaymentGatewayActive={handlePaymentGatewayActive}
          pgs={pgs}
        />
      )
    },
    {
      id: "analytics",
      title: "Analytics",
      content: (
        <AnalyticsSettings
          stepper={stepper}
          type="wizard-vertical"
          // handleChange={handleChange}
          productData={productData}
          setAnalytics={handleAnalyticsChange}
        />
      )
    }
  ]

    const submitHandler = async (action) => {
      if (action === 'sendback') {
        // Send Back: Call review API with checkbox data
        try {
          // Prepare review data based on checkboxes
          const reviewData = {
            nameApproved: !productData.enable_event,
            descriptionApproved: !productData.description_enabled,
            dateApproved: !(productData.start_date_enabled || productData.end_date_enabled),
            organizerApproved: !(productData.organization_enabled || productData.organizer_enabled)
          }

          console.log('=== SEND BACK - EVENT REVIEW SUBMISSION ===')
          console.log('Action:', action)
          console.log('Event ID:', productData.id)
          console.log('Review Data:', JSON.stringify(reviewData, null, 2))
          console.log('Checkbox States:', {
            enable_event: productData.enable_event,
            description_enabled: productData.description_enabled,
            start_date_enabled: productData.start_date_enabled,
            end_date_enabled: productData.end_date_enabled,
            organization_enabled: productData.organization_enabled,
            organizer_enabled: productData.organizer_enabled
          })

          if (!productData.id) {
            console.error('ERROR: Event ID is missing!')
            alert('Error: Event ID is missing!')
            return
          }

          console.log(`Calling API: POST /api/admin/events/${productData.id}/review`)
          
          const response = await EventService.reviewEvent(productData.id, reviewData)
          
          console.log('=== API RESPONSE SUCCESS ===')
          console.log('Status:', response.status)
          console.log('Response Data:', JSON.stringify(response.data, null, 2))
          
          alert('Event Request Sent Back Successfully!')
          
        } catch (error) {
          console.error('=== API RESPONSE ERROR ===')
          console.error('Error:', error)
          console.error('Error Message:', error.message)
          console.error('Response Status:', error.response?.status)
          console.error('Response Data:', error.response?.data)
          alert(`Error: ${error.response?.data?.message || 'Failed to submit review'}`)
        }
      } else if (action === 'approve') {
        console.log('=== APPROVE - FEATURES STEP DATA ===')
        console.log('Action:', action)
        console.log('Addons Feature Enabled:', productData.addons_feature)
        console.log('Addons:', productData.addons.filter(a => !a.deleted))
        console.log('Invitation Feature Enabled:', productData.invitation_feature)
        console.log('Invitation Packages:', productData.invitation_packages.filter(p => !p.deleted))
        

        alert('Event Request Approved! Check console for Features data.')
      }
    }
    
    // Determine button states based on checkbox values
    const hasEventEnabled = productData.enable_event
    const hasDescriptionEnabled = productData.description_enabled
    const hasStartDateEnabled = productData.start_date_enabled
    const hasEndDateEnabled = productData.end_date_enabled
    const hasOrganizationEnabled = productData.organization_enabled
    const hasOrganizerEnabled = productData.organizer_enabled
    const hasAnyCheckboxChecked = hasEventEnabled || hasDescriptionEnabled || hasStartDateEnabled || hasEndDateEnabled || hasOrganizationEnabled || hasOrganizerEnabled
    
    return (
        <>
      <div className="d-flex justify-content-end mb-1">
        <Button
          type="button"
          color="danger"
          className="btn-next"
          disabled={!hasAnyCheckboxChecked}
          onClick={() => submitHandler('sendback')}
          style={{ fontSize: '16px', padding: '8px 16px' }}>
          <span className="align-middle d-sm-inline-block d-none">
             Send Back
          </span>
        </Button>
        <Button
          type="button"
          color="success"
          className="btn-next ms-2"
          disabled={hasAnyCheckboxChecked}
          onClick={() => submitHandler('approve')}
          style={{ fontSize: '16px', padding: '8px 16px' }}>
          <span className="align-middle d-sm-inline-block d-none">
            Approve
          </span>
        </Button>
      </div>
            <Wizard
                type="vertical"
                ref={ref}
                steps={steps}
                options={{
                    linear: false
                }}
                instance={(el) => setStepper(el)}
            />
        </>
    )
}

export default NewEventRequests
