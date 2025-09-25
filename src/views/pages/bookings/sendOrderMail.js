
import { useState } from "react"
import {
  Row,
  Col,
  Form,
  Card,
  Label,
  Input,
  Button,
  CardBody,
  CardTitle,
  CardHeader
} from "reactstrap"

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import BookingService from "../../../services/BookingService"

const MySwal = withReactContent(Swal)

const SendBookingMail = () => {

    const [orderId, SetOrderId] = useState()
    const [ccMail, SetCCMail] = useState()
    const [processing, setProcessing] = useState(false)

  const handleSuccess = (message) => {
    return MySwal.fire({
      title: message,
      icon: "success",
      customClass: {
        confirmButton: "btn btn-primary"
      },
      buttonsStyling: false
    })
  }

  const handleError = (message) => {
    return MySwal.fire({
      title: message,
      icon: "error",
      customClass: {
        confirmButton: "btn btn-primary"
      },
      buttonsStyling: false
    })
  }

  const sendMail = () => {
    setProcessing(true)
        BookingService.sendBookingMail(orderId, ccMail)
        .then((res) => {

          if (res.data.status) {
            handleSuccess("Booking mail sent sucessfully")
          } else {
            handleError("Booking mail failed")
          }
          setProcessing(false)
        })
        .catch((err) => {
          console.log(err)
          handleError("Booking mail failed")
          setProcessing(false)
        })
  }

  /*const handleRetryJob = (id) => {
    BookingService.retryFailedJobs(id)
    .then(() => {
      handleSuccess("Job requeued sucessfully")
    })
    .catch(() => {
      handleError("Job requeue failed")
    })
  }*/

  return (
    <div>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle tag="h4">Send Order Mail</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            
            <Col sm="6" className="mb-1">
              <Label className="form-label" for="nameVertical">
                Order Id
              </Label>
              <Input
                value={orderId}
                onChange={(e) => SetOrderId(e.target.value)}
                autoFocus
                autoComplete="off"
              />
            </Col>
            <Col sm="6" className="mb-1">
              <Label className="form-label" for="nameVertical">
                CC Mail
              </Label>
              <Input
                value={ccMail}
                onChange={(e) => SetCCMail(e.target.value)}
                autoComplete="off"
              />
            </Col>
            <Col sm="12">
              <div className="d-flex">
                <Button className="me-1" color="primary" type="button" onClick={sendMail}>
                  {processing ? "Sending..." : "Submit" }
                </Button>
                <Button outline color="secondary" type="reset">
                  Reset
                </Button>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default SendBookingMail
