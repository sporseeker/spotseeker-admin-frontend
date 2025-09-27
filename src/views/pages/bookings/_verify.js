import {  useEffect, useState } from "react"
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
import BookingService from "../../../services/BookingService"
import ToastSucess from "../../../components/alerts/index"
import DataTable from "react-data-table-component"

const BookingVerify = () => {

  const [orderId, setOrderId] = useState(0)

  const verifyTicket = () => {
        BookingService.verifyBooking(orderId)
        .then((res) => {

          if (res.data.status) {
            ToastSucess("Verification sucess", res.data.data.id)
          } else {
            ToastSucess("Verification failed", res.data.data.id)
          }
        })
        .catch((err) => {
          console.log(err)
        })
  }

  useEffect(() => {
    const keyDownHandler = (event) => {
      //console.log("User pressed: ", event.key)

      if (event.key === "Enter") {
        event.preventDefault()
        verifyTicket()
      }
    }

    document.addEventListener("keydown", keyDownHandler)

    return () => {
        document.removeEventListener('keydown', keyDownHandler)
      }

  }, [])

  return (
    <div>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle tag="h4">Verify Tickets</CardTitle>
        </CardHeader>
        <CardBody>

            <Row>
              <Col sm="12" className="mb-1">
                <Label className="form-label" for="nameVertical">
                  Order Id
                </Label>
                <Input
                  type="text"
                  name="orderId"
                  id="orderId"
                  value={orderId}
                  onChangeCapture={(e) => setOrderId(e.target.value)}
                />
              </Col>
              <Col sm="12">
                <div className="d-flex">
                  <Button
                    className="me-1"
                    color="primary"
                    type="button"
                    onClick={verifyTicket}
                  >
                    Submit
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

export default BookingVerify
