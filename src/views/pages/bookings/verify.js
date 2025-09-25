import { useEffect, useState, useRef } from "react"
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
  CardHeader,
  CardFooter,
  Badge
} from "reactstrap"

// ** Actions
import { verifyBooking } from "../../../redux/qrscanner"

import { useSelector, useDispatch } from "react-redux"

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import BookingService from "../../../services/BookingService"

const MySwal = withReactContent(Swal)

const BookingVerify = () => {
  const [orderId, SetOrderId] = useState("")
  const [tempOrderId, SetTempOrderId] = useState("")
  const status = useSelector((state) => state.qrscanner.status)
  const color = useSelector((state) => state.qrscanner.color)
  //const scanData = useSelector(state => state.qrscanner.data)
  //const error = useSelector(state => state.qrscanner.error)
  const dispatch = useDispatch()

  const orderIdInputRef = useRef(null)
  const buttonRef = useRef(null)

  const [data, setData] = useState()
  const [selectedTickets, setSelectedTickets] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    orderIdInputRef.current.focus()
  }, [data])

  const handleButtonClick = (ticketNumber) => {
    setSelectedTickets((prevSelectedTickets) => {
      const isSelected = prevSelectedTickets.includes(ticketNumber)

      if (isSelected) {
        console.log('removed', ticketNumber)
        // If selected, remove it from the array
        return prevSelectedTickets.filter((ticket) => ticket !== ticketNumber)
      } else {
        // If not selected, add it to the array
        return [...prevSelectedTickets, ticketNumber]
      }
    })
  }

  const handleOrderIdInput = (orderId) => {
    SetOrderId(orderId)
    SetTempOrderId(orderId)
  }

  const handleRenderHtml = (data) => {
    return (
      <>
        <Row>
          <Col md="6">
            <ul style={{ textAlign: "left", fontSize: 45, textDecoration: "none" }}>
              <li><span>Total Tickets:</span> {data.tot_tickets}</li>
              <li><span>Packages:</span></li>
              <ul style={{ textAlign: "left", fontSize: 45, textDecoration: "none" }}>
                {
                  data.packages.map(pack => {
                    return (
                      <li key={pack.name}>{pack.name}({pack.price} {data.currency}) x {pack.ticket_count}</li>
                    )
                  })
                }
              </ul>
            </ul>
          </Col>
          <Col md="6">
            <ul style={{ textAlign: "left", fontSize: 45, textDecoration: "none" }}>
              <li><span>Order Id:</span> {data.order_id}</li>
              <li><span>Pay. Ref:</span> {data.payment_ref_no}</li>
              <li><span>Event:</span> {data.event}</li>
              <li><span>Name:</span> {data.cust_name}</li>
              <li><span>NIC:</span> {data.cust_nic}</li>
            </ul>
          </Col>
        </Row>
      </>
    )
  }

  const resetData = () => {
    setSelectedTickets([])
    setData(null)
    if (orderIdInputRef && orderIdInputRef.current) orderIdInputRef.current.focus()
  }

  const handleSuccess = (scanData) => {
    //let timerInterval
    return MySwal.fire({
      title: scanData.message,
      icon: "success",
      iconColor: 'white',
      html: handleRenderHtml(scanData.data),
      timerProgressBar: true,
      timer: 5000,
      grow: "fullscreen",
      didOpen() {
        
      },
      willClose() {
        resetData()
      },
      onRender: (modal) => {
        ReactDOM.render(handleRenderHtml(scanData.data), modal.querySelector('.swal2-content'))
      },
      didDestroy() {
        resetData()
      },
      customClass: {
        confirmButton: "btn btn-primary",
        popup: 'colored-toast',
        title: 'qr-modal',
        htmlContainer: 'qr-scan-details'
      },
      buttonsStyling: false
    })
  }

  const handleError = (scanData) => {
    return MySwal.fire({
      title: scanData.message,
      icon: "error",
      iconColor: 'white',
      html: scanData.data.length > 0 ? handleRenderHtml(scanData.data) : "",
      grow: "fullscreen",
      customClass: {
        confirmButton: "btn btn-lg btn-success",
        popup: 'colored-toast',
        title: 'qr-modal',
        htmlContainer: 'qr-scan-details'
      },
      buttonsStyling: false
    })
  }

  const handleWarning = (scanData) => {
    return MySwal.fire({
      title: scanData.message,
      icon: "warning",
      iconColor: 'white',
      html: handleRenderHtml(scanData.data),
      grow: "fullscreen",
      customClass: {
        confirmButton: "btn btn-lg btn-success",
        popup: 'colored-toast',
        title: 'qr-modal',
        htmlContainer: 'qr-scan-details'
      },
      buttonsStyling: false
    })
  }

  const handleCustError = (error) => {
    return MySwal.fire({
      title: error.message,
      icon: "error",
      customClass: {
        confirmButton: "btn btn-primary"
      },
      buttonsStyling: false
    })
  }

  const focusButton = () => {
    if (buttonRef.current) {
      buttonRef.current.click()
      console.log(buttonRef)
    }
  }

  const verifyTickets = (status) => {
    if (status === 'all') {
      MySwal.fire({
        title: 'Are you sure you want to verify all tickets?',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
        customClass: {
          actions: 'my-actions',
          confirmButton: 'verify-all-btn order-1 right-gap',
          denyButton: 'verify-all-btn order-3'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          setLoading(true)
          BookingService.verifyBooking(tempOrderId, data.sub_bookings.map(book => book.sub_order_id)).then(res => {
            resetData()
            handleSuccess(res.data)
            setLoading(false)
          }).catch(err => handleCustError(err))
        }
      })
    } else {
      if (selectedTickets.length > 0) {
        setLoading(true)
        BookingService.verifyBooking(tempOrderId, selectedTickets).then(res => {
          resetData()
          handleSuccess(res.data)
          setLoading(false)
        })
      } else {
        setLoading(false)
        const error = {
          message: "Please select tickets to verify"
        }
        handleCustError(error)
      }
    }

    orderIdInputRef.current.focus()
  }

  useEffect(() => {
    const keyDownHandler = async (event) => {
      console.log("User pressed: ", event.key)
      if (event.key === "Enter") {
        event.preventDefault()

        if (orderId !== null && (status !== 'idle' || status !== 'failed' || status !== 'loading')) {
          dispatch(verifyBooking(orderId))
            .unwrap()
            .then((originalPromiseResult) => {

              if (originalPromiseResult.data._v && originalPromiseResult.data._v === '2') {
                if (originalPromiseResult.data.status === 'verified') {
                  handleSuccess(originalPromiseResult)
                } else {
                  setData(originalPromiseResult.data)
                }
              } else {
                handleSuccess(originalPromiseResult)
              }

              SetOrderId("")

            })
            .catch((rejectedValueOrSerializedError) => {

              if (rejectedValueOrSerializedError.code === 400 && rejectedValueOrSerializedError.status === false) {
                //setData(rejectedValueOrSerializedError.data)
                handleError(rejectedValueOrSerializedError)
              } else if (rejectedValueOrSerializedError.code === 400 && rejectedValueOrSerializedError.status === true) {
                //setData(rejectedValueOrSerializedError.data)
                handleWarning(rejectedValueOrSerializedError)
              } else {
                handleCustError(rejectedValueOrSerializedError)
              }

              SetOrderId("")
            })
        } else {
          focusButton()
        }

      } else if (event.key === "Tab") {
        verifyTickets()
      }
    }

    document.addEventListener("keydown", keyDownHandler)

    return () => {
      document.removeEventListener("keydown", keyDownHandler)
    }


  }, [orderId])

  return (
    <div style={{ opacity: loading ? 0.1 : 8 }}>
      <Row>
        <Col xs={data ? 4 : 12} ><Card className="overflow-hidden">
          <CardHeader>
            <CardTitle tag="h4">Verify Tickets</CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col xs="12">
                <Row>
                  <Col sm="12" className="mb-1">QR Code Scan: <Badge color={color}>{status}</Badge></Col>
                </Row>
                <Row>
                  <Col sm="12" className="mb-1">
                    <Label className="form-label" for="nameVertical">
                      Order Id
                    </Label>
                    <Input
                      ref={orderIdInputRef}
                      value={orderId}
                      onChange={(e) => handleOrderIdInput(e.target.value)}
                      autoFocus
                      autoComplete="off"
                    />
                  </Col>
                </Row>

              </Col>
              {data && (<>
                <Col xs="12" className={`${data.status === 'complete' || data.status === 'verified' ? "success-bg" : "danger-bg"} p-1`}>
                  <ul style={{ textAlign: "left", fontSize: 20, textDecoration: "none", color: "white", listStyleType: 'none' }}>
                    <li style={{ fontSize: 30, color: '#4f4e4e' }}>{data.event}</li>
                    <li>{data.cust_name}</li>
                    <li>{data.cust_nic}</li>
                    <li><span>BID:</span> {data.order_id}</li>
                    <li><span>PREF:</span> {data.payment_ref_no}</li>

                  </ul>
                </Col>
                <Col xs="12" className={`${data.status === 'complete' || data.status === 'verified' ? "success-bg" : "danger-bg"} p-1`}>
                  <ul style={{ textAlign: "left", fontSize: 20, textDecoration: "none", color: "white" }}>
                    <li><span>Total Tickets:</span> {data.tot_tickets}</li>
                    <li><span>Packages:</span></li>
                    <ul style={{ textAlign: "left", fontSize: 20, textDecoration: "none" }}>
                      {
                        data.packages.map(pack => {
                          return (
                            <li key={pack.name}>{pack.name}({pack.price}) x {pack.ticket_count}</li>
                          )
                        })
                      }
                    </ul>
                  </ul>
                </Col>
              </>
              )}
            </Row>
          </CardBody>
        </Card>
        </Col>
        <Col xs={8} >
          {data && data.status === 'complete' && (<Card className={`overflow-hidden ${data.status === 'complete' ? "success-bg" : "danger-bg"}`}>
            <CardBody>
              <Row>

                <Col md="12">
                  {data.status === 'complete' && (
                    <>
                      
                      <Row>
                        {/*Array.from({ length: data.tot_tickets }, (_, index) => (
              <Col md="2" key={index}>
                <Button 
                active={false} 
                color={selectedTickets.includes(index + 1) || index + 1 <= data.tot_verified_tickets ? "warning" : "danger"}
                size="lg" 
                style={{padding: "20px 30px", width: "100px", fontSize: "30px", fontWeight: 900, marginBottom: "10px"}} 
                onClick={() => handleButtonClick(index + 1)}
                disabled={index + 1 <= data.tot_verified_tickets}
                >{index + 1}</Button>
              </Col>
            ))*/}
                        {data.sub_bookings ? data.sub_bookings.map((booking) => (
                          <Col md="4" key={booking.sub_order_id}>
                            <Button
                              active={false}
                              color={selectedTickets.includes(booking.sub_order_id) ? "warning" : booking.booking_status === 'verified' ? "secondary" : "danger"}
                              size="lg"
                              style={{ padding: "20px 10px", width: "100%", fontSize: "30px", fontWeight: 900, marginBottom: "10px" }}
                              onClick={() => handleButtonClick(booking.sub_order_id)}
                              disabled={booking.booking_status === 'verified'}
                            >
                              <span>{booking.sale_package.package.name}</span> <br /> <span style={{ fontSize: 20, color: '#4f4e4e' }}>{booking.sale_package.package.price} {data.currency}</span>
                            </Button>
                          </Col>
                        )) : null}

                      </Row></>
                  )}
                </Col>
              </Row>
              <Row>

              </Row>
            </CardBody>
            {data.status === 'complete' && (<CardFooter>
              <Row>
                <Col md="6">
                  <Button color="warning" size="lg" block onClick={() => verifyTickets()} className={"verify-all-btn"}>Verify Selected Tickets</Button>
                </Col>
                <Col md="6">
                  <Button color="secondary" size="lg" block innerRef={buttonRef} onClick={() => verifyTickets("all")} className={"verify-all-btn"}>Verify All Tickets</Button>
                </Col>
              </Row>
            </CardFooter>)}
          </Card>)}
        </Col>
      </Row>
    </div>
  )
}

export default BookingVerify
