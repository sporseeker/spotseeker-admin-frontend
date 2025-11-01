// ** React Imports
import { Fragment } from "react"

// ** Third Party Components
import { ArrowLeft, ArrowRight, Check, X } from "react-feather"

// ** Reactstrap Imports
import {
  Label,
  Row,
  Col,
  Button,
  Form,
  Input,
  Card,
  CardTitle,
  CardBody,
  CardHeader
} from "reactstrap"

const PaymentGateway = ({
  productData,
  stepper,
  pgs,
  handlePaymentGatewayActive
}) => {

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
          <Col md={4}>
            <h4>Payment Gateways</h4>
          </Col>
          {/* remove horizontal gutters so tiles can stretch to edges; show 2 tiles per row */}
          <Row className="gx-0 gy-2">
            {pgs.map((pg, index) => {
              const checked = productData.payment_gateways.some(
                (gateway) => gateway.id === pg.id && !gateway.deleted
              )

              return (
                <Col xs={12} sm={6} md={4} lg={6} className="px-0 mb-1" key={index}>
                  <div className="d-flex align-items-center    justify-content-between py-1">
                    <div className="me-8">
                      <div className="fw-bold small mb-0">{pg.name}</div>
                      {pg.description ? (
                        <small className="text-muted">{pg.description}</small>
                      ) : null}
                    </div>

                    <div className="form-switch form-check-success  mx-5 ">
                      <Input
                        type="switch"
                        id={`pg_${pg.id}`}
                        name={`pg_${pg.id}`}
                        onChange={(e) => handlePaymentGatewayActive(pg.id, e.target.checked)}
                        checked={checked}
                      />
                      <CustomLabel htmlFor={`pg_${pg.id}`} />
                    </div>
                  </div>
                </Col>
              )
            })}
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
          </div>
        </Form>
      ) : (
        ""
      )}
    </Fragment>
  )
}

export default PaymentGateway
