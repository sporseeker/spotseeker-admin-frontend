
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

const ETicketGenerate = () => {

    const [orderId, SetOrderId] = useState()
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

  const generateETicket = () => {
    setProcessing(true)
        BookingService.generateETicket(orderId)
        .then((res) => {

          if (res.data.status) {
            handleSuccess("Ticket generation job queued sucessfully")
          } else {
            handleError("Ticket generation job failed")
          }
          setProcessing(false)
        })
        .catch((err) => {
          console.log(err)
          handleError(err.response.data.message)
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
          <CardTitle tag="h4">Generate E ticket</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            
            <Col sm="6" className="mb-1">
              <Input
                value={orderId}
                onChange={(e) => SetOrderId(e.target.value)}
                autoFocus
                autoComplete="off"
                placeholder="Enter Booking ID"
              />
            </Col>
            <Col sm="6">
              <div className="d-flex">
                <Button className="me-1" color="primary" type="button" onClick={generateETicket}>
                  {processing ? "Processing..." : "Submit" }
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

export default ETicketGenerate
