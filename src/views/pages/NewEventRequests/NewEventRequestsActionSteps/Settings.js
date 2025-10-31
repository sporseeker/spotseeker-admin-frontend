// ** React Imports
import { Fragment, useEffect, useState } from "react"

// ** Third Party Components
import { ArrowLeft, ArrowRight, Check, X } from "react-feather"

// ** Reactstrap Imports
import {
  Label,
  Row,
  Col,
  Button,
  Form,
  Input

} from "reactstrap"

const Settings = ({
  handleChange,
  productData,
  handlePromotionStatus,
  stepper
}) => {
  const [handling_cost_perc, set_handling_cost_perc] = useState(
    productData.handling_cost_perc
  )

  useEffect(() => {
    set_handling_cost_perc(productData.handling_cost_perc)
  }, [productData])

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

  return (
    <Fragment>
      {productData !== null ? (
        <Form>
          <Row>
            <Col md="6" className="mb-1">
              <Label className="form-label" for="handling_cost">
                Handling cost (Amount or Percentage)
              </Label>
              <Input
                onChange={handleChange}
                type="text"
                name="handling_cost"
                value={productData.handling_cost}
              />
            </Col>
            <Col md="6" className="mb-1">
              <Row>
                <Col md={6} className="mb-md-0 mb-1">
                <Label className="form-label" for="handling_cost_perc">
                    Handling cost is percentage
                  </Label>
                  <div className="form-switch form-check-success">
                    <Input
                      type="switch"
                      id={`handling_cost_perc`}
                      name={`handling_cost_perc`}
                      onChange={(e) =>                        handlePromotionStatus(
                          null,
                          e.target.checked,
                          "handling_cost_perc"
                        )
                      }
                      defaultChecked={handling_cost_perc}
                      checked={handling_cost_perc}
                    />
                    <CustomLabel htmlFor={`handling_cost_perc`} />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
          
          
        </Row>
          <div className="d-flex justify-content-between">
            <Button
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
              onClick={() => stepper.next()}
            >
              <span className="align-middle d-sm-inline-block d-none">
                Next
              </span>
              <ArrowRight
                size={14}
                className="align-middle ms-sm-25 ms-0"
              ></ArrowRight>
            </Button>
          </div>
        </Form>
      ) : (
        ""
      )}
    </Fragment>
  )
}

export default Settings
