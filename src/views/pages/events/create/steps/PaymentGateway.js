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
          <Row>
            {pgs.map((pg, index) => (
              <Col md="6" className="mb-1" key={index}>
                <Row>
                  <Col md={6} className="mb-md-0 mb-1">
                    <h6>
                      <b>{pg.name}</b>
                    </h6>
                    <div className="form-switch form-check-success">
                      <Input
                        type="switch"
                        id={`pg_${pg.id}`}
                        name={`pg_${pg.id}`}
                        onChange={(e) => handlePaymentGatewayActive(pg.id, e.target.checked)}
                        checked={productData.payment_gateways.some(
                          (gateway) => gateway.id === pg.id && !gateway.deleted
                        )}
                      />
                      <CustomLabel htmlFor={`pg_${pg.id}`} />
                    </div>
                  </Col>
                </Row>
              </Col>
            ))}
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
