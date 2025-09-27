// ** React Imports
import { Fragment, useEffect, useState } from "react"

// ** Third Party Components
import { ArrowLeft, Check, X, Plus, ArrowRight } from "react-feather"

// ** Custom Components
import Select from "react-select"

// ** Reactstrap Imports
import {
  Label,
  Row,
  Col,
  Button,
  Form,
  Input,
  FormFeedback
} from "reactstrap"

const Features = ({
  handleChange,
  productData,
  handlePromotionStatus,
  stepper,
  handleDropdownChange,
  handleInvitationPackageAdd,
  handleInvitationPackageRemove,
  handleAddonAdd,
  handleAddonRemove,
  handleAddonInputChange
}) => {
  const [count, setCount] = useState(1)
  const [packs, setPacks] = useState([])

  const [addonCount, setAddonCount] = useState(1)
  const [addons, setAddons] = useState([])

  const [invitationQtyValid, setInvitationQtyValid] = useState(false)

  const addonCategoryOpts = [
    {
      value: "food",
      label: "Food"
    },
    {
      value: "beverages",
      label: "Beverages"
    },
    {
      value: "liquor",
      label: "Liquor"
    },
    {
      value: "other",
      label: "Other"
    }
  ]
  
  const increaseCount = (i) => {
    if (i !== null) {
      handleInvitationPackageAdd(i)
    } else {
      setCount(count + 1)
      handleInvitationPackageAdd()
    }
  }

  const deleteForm = (i) => {
    console.log(i, count - 1)
    setCount(count - 1)
    handleInvitationPackageRemove(i)
  }

  const increaseAddonCount = (i) => {
    if (i !== null) {
      handleAddonAdd(i)
    } else {
      setCount(addonCount + 1)
      handleAddonAdd()
    }
  }

  const deleteAddonForm = (i) => {
    console.log(i, addonCount - 1)
    setCount(addonCategoryOpts  - 1)
    handleAddonRemove(i)
  }

  const CustomLabel = ({ htmlFor }) => {
    return (
      <Label className="form-check-label" htmlFor={htmlFor}>
        <span className="switch-icon-left">
          <Check size={14} />
        </span>
        <span className="switch-icon-right">
          <X size={14} />
        </span>
      </Label>
    )
  }

  useEffect(() => {
    setCount(productData.invitation_packages.length)
    setPacks(productData.invitation_packages)

    setAddonCount(productData.addons.length)
    setAddons(productData.addons)

    console.log(productData)
    let totQty = 0
    productData.invitation_packages.map((pack) => {
      totQty += parseInt(pack.packageAvailQty)
    })

    if (totQty > productData.invitation_count) {
      setInvitationQtyValid(true)
    } else {
      setInvitationQtyValid(false)
    }
  }, [productData.invitation_packages])

  useEffect(() => {

    setAddonCount(productData.addons.length)
    setAddons(productData.addons)

  }, [productData.addons])

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
      {productData !== null ? (
        <Form>
          <Row>
            <Col md="12" className="mb-1">
              <Row>
                <Col md={4}>
                  <h4>Addons Feature</h4>
                </Col>
                <Col md={4}>
                  <div className="form-switch form-check-success">
                    <Input
                      type="switch"
                      id={`addons_feature`}
                      name={`addons_feature`}
                      onChange={(e) => {
                        handlePromotionStatus(
                          null,
                          e.target.checked,
                          "addons_feature"
                        )
                      }}
                      defaultChecked={productData.addons_feature}
                      checked={productData.addons_feature}
                    />
                    <CustomLabel htmlFor={`addons_feature`} />
                  </div>
                </Col>
              </Row>
              {productData.addons_feature && (
                <Row>
                  {addons.map((pack, i) => {
                    return (
                      <Row className="justify-content-between align-items-center">
                        <Col md={10}>
                          <Row>
                            <Col md={4} className="mb-md-0 mb-1">
                              <Label
                                className="form-label"
                                for={`addonName-${i}`}>
                                Addon Name
                              </Label>
                              <Input
                                type="text"
                                id={`addonName-${i}`}
                                onChange={(e) => handleAddonInputChange(e, i, "input")}
                                value={pack.addonName}
                                name="addonName"
                              />
                            </Col>
                            <Col md={4}>
                              <Label
                                className="form-label"
                                for={`addonPrice-${i}`}>
                                Price
                              </Label>
                              <Input
                                name="addonPrice"
                                type="text"
                                id={`addonPrice-${i}`}
                                value={pack["addonPrice"]}
                                onChange={(e) => handleAddonInputChange(e, i, "input")}
                              />
                            </Col>
                            <Col md={2}>
                              <Label
                                className="form-label"
                                for={`addonCategory-${i}`}>
                                Category 
                              </Label>
                              <Select
                                name={`addonCategory-${i}`}
                                className="react-select"
                                classNamePrefix="select"
                                value={addonCategoryOpts.find(
                                  ({ value }) => value === pack["addonCategory"]
                                )}
                                options={addonCategoryOpts}
                                onChange={(option, action) => handleAddonInputChange(null, i, "select", option, action)}
                              />
                            </Col>
                            <Col md={2}>
                              <Label className='form-label' for='addonImage'>
                                Addon Image
                              </Label>
                              <Input type='file' onChange={(e) => handleAddonInputChange(e, i, "file")} name="addonImage" />
                              {productData.ftype === 'edit' ? <img src={pack.addonImage} width="150" /> : ''}
                            </Col>
                          </Row>
                        </Col>
                        <Col md={2}>
                          <Button
                            color={pack.deleted ? "success" : "danger"}
                            className="text-nowrap px-1"
                            onClick={() => {
                              pack.deleted ? increaseAddonCount(i) : deleteAddonForm(i)
                            }}
                            outline>
                            {pack.deleted ? (
                              <Plus size={14} className="me-50" />
                            ) : (
                              <X size={14} className="me-50" />
                            )}
                            <span>{pack.deleted ? "Add again" : "Delete"}</span>
                          </Button>
                        </Col>
                        <Col sm={12}>
                          <hr />
                        </Col>
                      </Row>
                    )
                  })}
                  <Button
                    className="btn-icon"
                    color="primary"
                    onClick={() => increaseAddonCount()}>
                    <Plus size={14} />
                    <span className="align-middle ms-25">Add New Addon</span>
                  </Button>
                </Row>
              )}
            </Col>
            <Col md="12" className="mb-1">
              <Row>
                <Col md={4}>
                  <h4>Invitation Feature</h4>
                </Col>
                <Col md={4}>
                  <div className="form-switch form-check-success">
                    <Input
                      type="switch"
                      id={`invitation_feature`}
                      name={`invitation_feature`}
                      onChange={(e) => {
                        handlePromotionStatus(
                          null,
                          e.target.checked,
                          "invitation_feature"
                        )
                      }}
                      defaultChecked={productData.invitation_feature}
                      checked={productData.invitation_feature}
                    />
                    <CustomLabel htmlFor={`invitation_feature`} />
                  </div>
                </Col>
                {productData.invitation_feature ? (
                  <Col md={4}>
                    <Label className="form-label" for="handling_cost">
                      Total Invitations Count
                    </Label>
                    <Input
                      onChange={handleChange}
                      type="text"
                      name="invitation_count"
                      value={productData.invitation_count}
                      invalid={invitationQtyValid}
                    />
                    <FormFeedback invalid>
                      Package inv. count should less than total inv. count
                    </FormFeedback>
                  </Col>
                ) : (
                  ""
                )}
              </Row>
              {productData.invitation_feature && (
                <Row>
                  {packs.map((pack, i) => {
                    return (
                      <Row className="justify-content-between align-items-center">
                        <Col md={10}>
                          <Row>
                            <Col md={4} className="mb-md-0 mb-1">
                              <Label
                                className="form-label"
                                for={`packageName-${i}`}>
                                Package Name
                              </Label>
                              <Input
                                type="text"
                                id={`packageName-${i}`}
                                onChange={(e) => handleChange(e, i, "inv")}
                                value={pack.packageName}
                                name="packageName"
                              />
                            </Col>
                            <Col md={4}>
                              <Label
                                className="form-label"
                                for={`packageDesc-${i}`}>
                                Description
                              </Label>
                              <Input
                                name="packageDesc"
                                type="text"
                                id={`packageDesc-${i}`}
                                value={pack["packageDesc"]}
                                onChange={(e) => handleChange(e, i, "inv")}
                              />
                            </Col>
                            <Col md={2}>
                              <Label
                                className="form-label"
                                for={`packageFreeSeating-${i}`}>
                                Free Seating
                              </Label>
                              <Select
                                name={`packageFreeSeating`}
                                className="react-select"
                                classNamePrefix="select"
                                value={featuredOpts.find(
                                  ({ value }) => value === pack["packageFreeSeating"]
                                )}
                                options={featuredOpts}
                                onChange={(option, action) => handleDropdownChange(option, action, i, "inv")
                                }
                              />
                            </Col>
                            <Col md={2}>
                              <Label className="form-label" for={`active-${i}`}>
                                Active
                              </Label>
                              <Select
                                name={`active`}
                                className="react-select"
                                classNamePrefix="select"
                                value={featuredOpts.find(
                                  ({ value }) => value === pack["active"]
                                )}
                                options={featuredOpts}
                                onChange={(option, action) => handleDropdownChange(option, action, i, "inv")
                                }
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col md={2} className="mb-md-0 mb-1">
                              <Label
                                className="form-label"
                                for={`packageAvailQty-${i}`}>
                                Quantity
                              </Label>
                              <Input
                                type="number"
                                id={`packageAvailQty-${i}`}
                                onChange={(e) => handleChange(e, i, "inv")}
                                value={pack["packageAvailQty"]}
                                name="packageAvailQty"
                                invalid={invitationQtyValid}
                              />
                              <FormFeedback invalid>
                                Package inv. count should less than total inv.
                                count
                              </FormFeedback>
                            </Col>
                            <Col md={2} className="mb-md-0 mb-1">
                              <Label
                                className="form-label"
                                for={`packageSoldQty-${i}`}>
                                Sent Qty.
                              </Label>
                              <Input
                                type="number"
                                value={pack["packageSoldQty"]}
                                id={`packageSoldQty-${i}`}
                                onChange={(e) => handleChange(e, i, "inv")}
                                name="packageSoldQty"
                                disabled
                                readOnly
                              />
                            </Col>
                          </Row>
                          {!productData.free_seating &&
                          !pack["packageFreeSeating"] ? (
                            <>
                              <Row>
                                <Col md={12}>
                                  <Label
                                    className="form-label"
                                    for={`packageAllocSeats-${i}`}>
                                    Allocated Seats
                                  </Label>
                                  <Input
                                    name="packageAllocSeats"
                                    type="textarea"
                                    id={`packageAllocSeats-${i}`}
                                    value={pack["packageAllocSeats"]}
                                    onChange={(e) => handleChange(e, i, "inv")}
                                  />
                                </Col>
                              </Row>
                            </>
                          ) : (
                            ""
                          )}
                        </Col>
                        <Col md={2}>
                          <Button
                            color={pack.deleted ? "success" : "danger"}
                            className="text-nowrap px-1"
                            onClick={() => {
                              pack.deleted ? increaseCount(i) : deleteForm(i)
                            }}
                            outline>
                            {pack.deleted ? (
                              <Plus size={14} className="me-50" />
                            ) : (
                              <X size={14} className="me-50" />
                            )}
                            <span>{pack.deleted ? "Add again" : "Delete"}</span>
                          </Button>
                        </Col>
                        <Col sm={12}>
                          <hr />
                        </Col>
                      </Row>
                    )
                  })}
                  <Button
                    className="btn-icon"
                    color="primary"
                    onClick={() => increaseCount()}>
                    <Plus size={14} />
                    <span className="align-middle ms-25">Add New</span>
                  </Button>
                </Row>
              )}
            </Col>
          </Row>
          <div className="d-flex justify-content-between">
            <Button
              color="primary"
              className="btn-prev"
              onClick={() => stepper.previous()}>
              <ArrowLeft
                size={14}
                className="align-middle me-sm-25 me-0"></ArrowLeft>
              <span className="align-middle d-sm-inline-block d-none">
                Previous
              </span>
            </Button>
            <Button
                          type="button"
                          color="primary"
                          className="btn-next"
                          onClick={() => stepper.next()}>
                          <span className="align-middle d-sm-inline-block d-none">
                            Next
                          </span>
                          <ArrowRight
                            size={14}
                            className="align-middle ms-sm-25 ms-0"></ArrowRight>
                        </Button>
          </div>
        </Form>
      ) : (
        ""
      )}
    </Fragment>
  )
}

export default Features
