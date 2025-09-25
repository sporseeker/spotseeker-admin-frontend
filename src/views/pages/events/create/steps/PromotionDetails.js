// ** React Imports
import { Fragment, useState, useEffect } from "react"

//import { useSelector } from 'react-redux'

// ** Third Party Components
import { X, Plus, ArrowLeft, ArrowRight, Check } from "react-feather"

// ** Custom Components
import Repeater from '@components/repeater'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'

// ** Reactstrap Imports
import { Label, Row, Col, Button, Form, Input, CardBody, CardText } from "reactstrap"
import { trueFalseOpts, promoRedeems } from "../../../../../utility/Utils"

const PromotionDetails = ({ stepper, productData, handlePromoChange, handlePromotionStatus, handlePromoDropdownChange }) => {

  //const productData = useSelector((state) => state.productmgt.productData)
  const [Count, setCount] = useState(1)
  const [packs, setPacks] = useState([])
  
  const onSubmit = () => {
    stepper.next()
  }

  useEffect(() => {
    const activeCats = productData.invoice.filter(item => {
      return item.deleted === false && item.packageName !== "" && item.packageName !== null
    })
    setCount(activeCats.length)
    setPacks(activeCats)
    console.log(activeCats)
  }, [productData.invoice])

  const CustomLabel = ({ htmlFor }) => {
    return (
      <Label className='form-check-label' htmlFor={htmlFor}>
        <span className='switch-icon-left'>
          <Check size={14} />
        </span>
        <span className='switch-icon-right'>
          <X size={14} />
        </span>
      </Label>
    )
  }

  return (
    <Fragment>
      <Form>
        <Row>
          <Col md="12" className="mb-1">
            <CardBody>
                {
                  packs.length === 0 ? <code>Add Packages to enable promotions</code> : packs.map((pack, i) => {
                    return (

                      <div key={i}>
                          <Row className="justify-content-between align-items-center">
                            <Col md={12}>
                              <Row>
                                <Col md={3} className="mb-md-0 mb-1">
                                  <h4>{pack.packageName}</h4>
                                </Col>
                                <Col md={3} className="mb-md-0 mb-1">
                                  <div className='form-switch form-check-success'>
                                    <Input type='switch' id={`promo-status-${i}`} name={`promo-status-${i}`} onChange={e => handlePromotionStatus(i, e.target.checked, "promotions")} defaultChecked={ pack.promotions } checked={pack.promotions}/>
                                    <CustomLabel htmlFor={`promo-status-${i}`} />
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          { pack.promotions ? pack.promotion.map((promo, j) => { 
                            return (
                              <Row className="justify-content-between align-items-center">
                            <Col md={12}>
                              <Row>
                                <Col md={2}>
                                  <Label
                                    className="form-label"
                                    for={`promoCode-${i}-${j}`}
                                  >
                                    Promo Code
                                  </Label>
                                  <Input
                                    name="promoCode"
                                    type="text"
                                    id={`promoCode-${i}-${j}`}
                                    value={promo.promoCode}
                                    onChange={e => handlePromoChange(e, i, j)}
                                  />
                                </Col>
                                <Col md={2} className="mb-md-0 mb-1">
                                  <Label
                                    className="form-label"
                                    for={`discAmount-${i}-${j}`}
                                  >
                                    Discount Amount
                                  </Label>
                                  <Input
                                    type="number"
                                    id={`discAmount-${i}-${j}`}
                                    onChange={e => handlePromoChange(e, i, j)}
                                    value={promo.discAmount}
                                    name={`discAmount`}
                                  />
                                </Col>
                                <Col md={2}>
                                  <Label
                                    className="form-label"
                                    for={`discAmtIsPercentage-${i}-${j}`}
                                  >
                                    Percentage
                                  </Label>
                                  <Select
                                    name={`discAmtIsPercentage-${i}-${j}`}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={trueFalseOpts.find(({ value }) => value === promo.discAmtIsPercentage)}
                                    options={trueFalseOpts}
                                    onChange={handlePromoDropdownChange}
                                  />
                                </Col>
                                <Col md={2} className="mb-md-0 mb-1">
                                  <Label
                                    className="form-label"
                                    for={`isPerTicket-${i}-${j}`}
                                  >
                                    Per Ticket
                                  </Label>
                                  <Select
                                    name={`isPerTicket-${i}-${j}`}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={trueFalseOpts.find(({ value }) => value === promo.isPerTicket)}
                                    options={trueFalseOpts}
                                    onChange={handlePromoDropdownChange}
                                  />
                                </Col>
                                <Col md={2}>
                                  <Label
                                    className="form-label"
                                    for={`minTickets-${i}-${j}`}
                                  >
                                    Min Tickets
                                  </Label>
                                  <Input
                                    name="minTickets"
                                    type="text"
                                    id={`minTickets-${i}-${j}`}
                                    value={promo.minTickets}
                                    onChange={e => handlePromoChange(e, i, j)}
                                  />
                                </Col>
                                
                              </Row>
                              <Row>
                                
                                <Col md={2}>
                                  <Label
                                    className="form-label"
                                    for={`maxTickets-${i}-${j}`}
                                  >
                                    Max Tickets
                                  </Label>
                                  <Input
                                    name={`maxTickets`}
                                    type="text"
                                    id={`maxTickets-${i}-${j}`}
                                    value={promo.maxTickets}
                                    onChange={e => handlePromoChange(e, i, j)}
                                  />
                                </Col>
                                <Col md={2}>
                                  <Label
                                    className="form-label"
                                    for={`isAutoApply-${i}-${j}`}
                                  >
                                    Auto Apply
                                  </Label>
                                  <Select
                                    name={`isAutoApply-${i}-${j}`}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={trueFalseOpts.find(({ value }) => value === promo.isAutoApply)}
                                    options={trueFalseOpts}
                                    onChange={handlePromoDropdownChange}
                                  />
                                </Col>
                                <Col md={2}>
                                  <Label
                                    className="form-label"
                                    for={`redeems-${i}-${j}`}
                                  >
                                    No. of Redeems
                                  </Label>
                                  <Select
                                    name={`redeems-${i}-${j}`}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={promoRedeems.find(({ value }) => value === promo.redeems)}
                                    options={promoRedeems}
                                    onChange={handlePromoDropdownChange}
                                  />
                                </Col>
                              </Row>
                              <Row>
                                
                                
                              </Row>
                            </Col>
                            <Col sm={12}>
                              <hr />
                            </Col>
                              </Row>
                            )
                          }) : "" }
                      </div>

                    )
                  })
                  
                }
            </CardBody>
          </Col>
        </Row>
        <div className="d-flex justify-content-between">
          <Button
            type="button"
            color="primary"
            className="btn-prev"
            onClick={() => stepper.previous()}
          >
            <ArrowLeft
              size={14}
              className="align-middle me-sm-25 me-0"
            ></ArrowLeft>
            <span className="align-middle d-sm-inline-block d-none">
              Previous
            </span>
          </Button>
          <Button
            type="button"
            color="primary"
            className="btn-next"
            onClick={onSubmit}
          >
            <span className="align-middle d-sm-inline-block d-none">Next</span>
            <ArrowRight
              size={14}
              className="align-middle ms-sm-25 ms-0"
            ></ArrowRight>
          </Button>
        </div>
      </Form>
    </Fragment>
  )
}

export default PromotionDetails
