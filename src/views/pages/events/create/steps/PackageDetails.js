// ** React Imports
import { Fragment, useState, useEffect } from "react"

//import { useSelector } from 'react-redux'

// ** Third Party Components
import { X, Plus, ArrowLeft, ArrowRight } from "react-feather"
// ** Custom Components
import Select from 'react-select'
// ** Reactstrap Imports
import { Label, Row, Col, Button, Form, Input, CardBody, CardText } from "reactstrap"

const PackageDetails = ({ stepper, productData, handleChange, handlePackageAdd, handlePackageRemove, handleDropdownChange, handlePackageActiveChange }) => {

  //const productData = useSelector((state) => state.productmgt.productData)
  const [count, setCount] = useState(1)
  const [packs, setPacks] = useState([])
  
  const onSubmit = () => {
    stepper.next()
  }

  const increaseCount = (i) => {
    if (i !== null) {
      handlePackageAdd(i)
    } else {
      setCount(count + 1)
      handlePackageAdd()
    }
  }

  const deleteForm = (i) => {
    console.log(i)
    setCount(count - 1)
    handlePackageRemove(i)
  }

  useEffect(() => {
    setCount(productData.invoice.length)
    setPacks(productData.invoice)
  }, [productData.invoice])

  const featuredOpts = [
    {
      value: true,
      label: "Yes"
    },
    {
      value: false,
      label: "No"
    }
  ]

  return (
    <Fragment>
      <Form>
        <Row>
          <Col md="12" className="mb-1">
            <CardBody>

                {
                  packs.map((pack, i) => {
                    return (

                          <Row className="justify-content-between align-items-center">
                            <Col md={10}>
                              <Row>
                                <Col md={4} className="mb-md-0 mb-1">
                                  <Label
                                    className="form-label"
                                    for={`packageName-${i}`}
                                  >
                                    Package Name
                                  </Label>
                                  <Input
                                    type="text"
                                    id={`packageName-${i}`}
                                    onChange={e => handleChange(e, i)}
                                    value={pack.packageName}
                                    name="packageName"
                                  />
                                </Col>
                                <Col md={2}>
                                  <Label
                                    className="form-label"
                                    for={`packageFreeSeating-${i}`}
                                  >
                                    Free Seating
                                  </Label>
                                  <Select
                                    name={`fs-${i}`}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={featuredOpts.find(({ value }) => value === pack["packageFreeSeating"])}
                                    options={featuredOpts}
                                    onChange={handleDropdownChange}
                                  />
                                </Col>
                                <Col md={2}>
                                  <Label
                                    className="form-label"
                                    for={`active-${i}`}
                                  >
                                    Active
                                  </Label>
                                  <Select
                                    name={`active-${i}`}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={featuredOpts.find(({ value }) => value === pack["active"])}
                                    options={featuredOpts}
                                    onChange={handlePackageActiveChange}
                                  />
                                </Col>
                              </Row>
                              <Row>
                                <Col md={2} className="mb-md-0 mb-1">
                                  <Label
                                    className="form-label"
                                    for={`packagePrice-${i}`}
                                  >
                                    Price
                                  </Label>
                                  <Input
                                    type="number"
                                    id={`packagePrice-${i}`}
                                    onChange={e => handleChange(e, i)}
                                    value={pack["packagePrice"]}
                                    name="packagePrice"
                                  />
                                </Col>
                                <Col md={2} className="mb-md-0 mb-1">
                                  <Label
                                    className="form-label"
                                    for={`packageQty-${i}`}
                                  >
                                    Quantity
                                  </Label>
                                  <Input
                                    type="number"
                                    id={`packageQty-${i}`}
                                    onChange={e => handleChange(e, i)}
                                    value={pack["packageQty"]}
                                    name="packageQty"
                                  />
                                </Col>
                                <Col md={2} className="mb-md-0 mb-1">
                                  <Label
                                    className="form-label"
                                    for={`packageAvailQty-${i}`}
                                  >
                                    Available Qty.
                                  </Label>
                                  <Input
                                    type="number"
                                    id={`packageAvailQty-${i}`}
                                    onChange={e => handleChange(e, i)}
                                    value={pack["packageAvailQty"]}
                                    name="packageAvailQty"
                                  />
                                </Col>
                                <Col md={2} className="mb-md-0 mb-1">
                                  <Label
                                    className="form-label"
                                    for={`packageResQty-${i}`}
                                  >
                                    Reserved Qty.
                                  </Label>
                                  <Input
                                    type="number"
                                    value={pack["packageResQty"]}
                                    id={`packageResQty-${i}`}
                                    onChange={e => handleChange(e, i)}
                                    name="packageResQty"
                                  />
                                </Col>
                                <Col md={2} className="mb-md-0 mb-1">
                                  <Label
                                    className="form-label"
                                    for={`packageSoldQty-${i}`}
                                  >
                                    Sold Qty.
                                  </Label>
                                  <Input
                                    type="number"
                                    value={pack["packageSoldQty"]}
                                    id={`packageSoldQty-${i}`}
                                    onChange={e => handleChange(e, i)}
                                    name="packageSoldQty"
                                    disabled
                                    readOnly
                                  />
                                </Col>
                                <Col md={2}>
                                  <Label
                                    className="form-label"
                                    for={`soldout-${i}`}
                                  >
                                    Sold Out
                                  </Label>
                                  <Select
                                    name={`soldout-${i}`}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={featuredOpts.find(({ value }) => value === pack["sold_out"])}
                                    options={featuredOpts}
                                    onChange={handlePackageActiveChange}
                                  />
                                </Col>
                              </Row>
                              <Row>
                              {/*<Col md={2}>
                                  <Label
                                    className="form-label"
                                    for={`maxBuyTickets-${i}`}
                                  >
                                    Max Tickets Can Buy
                                  </Label>
                                  <Input
                                    type="number"
                                    value={pack["maxBuyTickets"]}
                                    id={`maxBuyTickets-${i}`}
                                    onChange={e => handleChange(e, i)}
                                    name="maxBuyTickets"
                                  />
                                </Col>*/}
                                
                              </Row>
                              {
                                !productData.free_seating && !pack["packageFreeSeating"] ? <><Row>
                                <Col md={12}>
                                  <Label
                                    className="form-label"
                                    for={`packageAllocSeats-${i}`}
                                  >
                                    Allocated Seats
                                  </Label>
                                  <Input
                                    name="packageAllocSeats"
                                    type="textarea"
                                    id={`packageAllocSeats-${i}`}
                                    value={pack["packageAllocSeats"]}
                                    onChange={e => handleChange(e, i)}
                                  />
                                </Col></Row><Row>
                                  <Col md={12}>
                                    <Label
                                      className="form-label"
                                      for={`packageAvailSeats-${i}`}
                                    >
                                      Unavailable Seats
                                    </Label>
                                    <Input
                                      name="packageAvailSeats"
                                      type="textarea"
                                      id={`packageAvailSeats-${i}`}
                                      value={pack["packageAvailSeats"]}
                                      onChange={e => handleChange(e, i)}
                                    />
                                  </Col>
                                  {/*<Col md={6}>
                                    <Label
                                      className="form-label"
                                      for={`animation-price-${i}`}
                                    >
                                      Reserved Seats
                                    </Label>
                                    <Input
                                      name="packageResSeats"
                                      type="textarea"
                                      id={`animation-quantity-${i}`}
                                      value={productData.invoice[i]["packageResSeats"]}
                                      onChange={e => handleChange(e, i)}
                                    />
                                  </Col>*/}
                                </Row></> : ""
                              }
                            </Col>
                            <Col md={2}>
                              <Button
                                color={pack.deleted ? "success" : "danger"}
                                className="text-nowrap px-1"
                                onClick={() => { pack.deleted ? increaseCount(i) : deleteForm(i) }}
                                outline>
                                {pack.deleted ? <Plus size={14} className="me-50" /> : <X size={14} className="me-50" />}
                                <span>{pack.deleted ? "Add again" : "Delete"}</span>
                              </Button>
                            </Col>
                            <Col sm={12}>
                              <hr />
                            </Col>
                          </Row>
                    )
                  })
                }
              <Button
                className="btn-icon"
                color="primary"
                onClick={() => increaseCount()}
              >
                <Plus size={14} />
                <span className="align-middle ms-25">Add New</span>
              </Button>
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

export default PackageDetails
