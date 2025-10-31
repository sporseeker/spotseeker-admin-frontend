
import { Button } from 'reactstrap'
import { useImmer } from 'use-immer'
import Wizard from "@components/wizard"
import { useRef, useState } from 'react'
import BasicDetails from './NewEventRequestsActionSteps/BasicDetails'
import PackageDetails from './NewEventRequestsActionSteps/PackageDetails'
import PromotionDetails from './NewEventRequestsActionSteps/PromotionDetails'
import Settings from './NewEventRequestsActionSteps/Settings'
import Features from './NewEventRequestsActionSteps/Features'

const NewEventRequests = () => {
    const ref = useRef(null)

const [stepper, setStepper] = useState(null)
  const [productData, setProductData] = useImmer({
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
    currency: "",
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
const steps = [
    {
      id: "basic-details",
      title: "Basic Details",
      content: (
        <BasicDetails
          stepper={stepper}
          type="wizard-vertical"
        //   handleStartDateChange={handleStartDateChange}
        //   handleEndDateChange={handleEndDateChange}
        //   handleChange={handleChange}
        //   handleDropdownChange={handleDropdownChange}
        //   handleFileChange={handleFileChange}
            productData={productData}
        //   handleEditor={handleEditor}
        //   handleEditorChange={handleEditorChange}
        //   editorValue={editorValue}
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
          // handleChange={handleChange}
          productData={productData}
          // handleInvitationPackageAdd={handleInvitationPackageAdd}
          // handleInvitationPackageRemove={handleInvitationPackageRemove}
          handlePromotionStatus={handlePromotionStatus}
          // handleDropdownChange={handleDropdownChange}
          // submitHandler={submitHandler}
          // handleAddonAdd={handleAddonAdd}
          // handleAddonRemove={handleAddonRemove}
          // handleAddonInputChange={handleAddonInputChange}
        />
      )
    }
    // {
    //   id: "payment-details",
    //   title: "Payment Methods",
    //   content: (
    //     <PaymentGateway
    //       stepper={stepper}
    //       type="wizard-vertical"
    //       handleChange={handleChange}
    //       productData={productData}
    //       handlePromotionStatus={handlePromotionStatus}
    //       handlePaymentGatewayActive={handlePaymentGatewayActive}
    //       pgs={pgs}
    //     />
    //   )
    // },
    // {
    //   id: "analytics",
    //   title: "Analytics",
    //   content: (
    //     <AnalyticsSettings
    //       stepper={stepper}
    //       type="wizard-vertical"
    //       handleChange={handleChange}
    //       productData={productData}
    //       setAnalytics={handleAnalyticsChange}
    //     />
    //   )
    // }
  ]

    const submitHandler = () => { }
    return (
        <>
      <div className="d-flex justify-content-end mb-1">
        <Button
          type="button"
          color="danger"
          className="btn-next"
          onClick={() => submitHandler()}>
          <span className="align-middle d-sm-inline-block d-none">
             Send Back
          </span>
        </Button>
        <Button
          type="button"
          color="success"
          className="btn-next ms-2"
          onClick={() => submitHandler()}>
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
