// ** React Imports
import { useState, useEffect } from 'react'

// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import { User, Briefcase, Mail, Calendar, DollarSign, X, Phone } from 'react-feather'

// ** Reactstrap Imports
import { Modal, Input, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText, ModalFooter, Row, Col } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Select from 'react-select'
import { getStatus, paymentStatuses, trueFalseOpts } from '../../../../utility/Utils'
import BookingService from '../../../../services/BookingService'
import { Alert } from '../../../../utility/alerts'

const BookingEditModal = ({ open, handleModal, booking, handleAjax }) => {
  // ** State
  const [paymentStatus, setPaymentStatus] = useState(booking.payment_status)
  const [paymentRef, setPaymentRef] = useState(booking.payment_ref_no)
  const [customerMail, setCustomerMail] = useState(booking.cust_email)
  const [customerPhone, setCustomerPhone] = useState(booking.cust_phone)
  const [paymentAmount, setPaymentAmount] = useState(booking.tot_amount)
  const [seatNos, setSeatNos] = useState(booking.package_seat_nos)
  const [comment, setComment] = useState(booking.comment)
  const [packageId, setPackageId] = useState(booking.sale_package_id)
  const [generateTicket, setGenerateTicket] = useState(false)

  // ** Custom close bt
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />

  useEffect(() => {
    setPaymentRef(booking.payment_ref_no)
    setCustomerMail(booking.cust_email)
    setCustomerPhone(booking.cust_phone)
    setPaymentStatus(booking.payment_status)
    setPaymentAmount(booking.tot_amount)
    setSeatNos(Array.isArray(booking.package_seat_nos) ? booking.package_seat_nos.join(",") : "")
    setComment(booking.comment)
    setPackageId(booking.sale_package_id)
  }, [booking])

  const handleSubmit = () => {

    const updateBooking = {
      order_id: booking.order_id,
      status: paymentStatus,
      payment_ref: paymentRef,
      payment_amount: paymentAmount,
      cust_mail: customerMail,
      cust_phone: customerPhone,
      seat_nos: seatNos,
      comment,
      sale_package_id: packageId,
      generate_ticket: generateTicket
    }
    return BookingService.updateBooking(updateBooking, booking.id)
  }

  const checkForm = () => {
    if (booking.payment_status !== paymentStatus && comment === null) {
      Alert("Please provide a comment", "error")
    } else {
      handleAjax(handleSubmit)
    }
  }

  return (
    <Modal
      isOpen={open}
      toggle={handleModal}
      className='modal-dialog-centered modal-lg'
      contentClassName='pt-0'
    >
      <ModalHeader className='mb-1' toggle={handleModal} close={CloseBtn} tag='div'>
        <h5 className='modal-title'>Edit Booking #{booking.order_id} {getStatus(booking.payment_status)}</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
        <Row>
          <Col md="6">
            <div className='mb-1'>
              <Label className='form-label' for='payment-ref'>
                Payment Ref
              </Label>
              <InputGroup>
                <InputGroupText>
                  <DollarSign size={15} />
                </InputGroupText>
                <Input id='payment-ref' onChange={e => setPaymentRef(e.target.value)} value={paymentRef} />
              </InputGroup>
            </div>
          </Col>
          <Col md="6">
            <div className='mb-1'>
              <Label className='form-label' for='payment-amount'>
                Payment Amount
              </Label>
              <InputGroup>
                <InputGroupText>
                  <DollarSign size={15} />
                </InputGroupText>
                <Input id='payment-amount' onChange={e => setPaymentAmount(e.target.value)} value={paymentAmount} />
              </InputGroup>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <div className='mb-1'>
              <Label className='form-label' for='cust-mail'>
                Customer Mail
              </Label>
              <InputGroup>
                <InputGroupText>
                  <Mail size={15} />
                </InputGroupText>
                <Input id='cust-mail' onChange={e => setCustomerMail(e.target.value)} value={customerMail} />
              </InputGroup>
            </div>
          </Col>
          <Col md="6">
            <div className='mb-1'>
              <Label className='form-label' for='cust-phone'>
                Customer Phone
              </Label>
              <InputGroup>
                <InputGroupText>
                  <Phone size={15} />
                </InputGroupText>
                <Input id='cust-phone' onChange={e => setCustomerPhone(e.target.value)} value={customerPhone} />
              </InputGroup>
            </div>

          </Col>
        </Row>
        <Row>
          <Col md="6">
            <div className='mb-1'>
              <Label className='form-label' for='status'>
                Seat No(s)
              </Label>
              <Input id='seat-nos' onChange={e => setSeatNos(e.target.value)} value={seatNos} type="textarea" />
            </div>
          </Col>
          <Col md="6">
            <div className='mb-1'>
              <Label className='form-label' for='status'>
                Comment
              </Label>
              <Input id='comment' onChange={e => setComment(e.target.value)} value={comment} type="textarea" />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <div className='mb-1'>
              <Label className='form-label' for='status'>
                Status
              </Label>
              <Select
                className='react-select'
                classNamePrefix='select'
                value={paymentStatuses.find(({ value }) => value === paymentStatus)}
                options={paymentStatuses}
                isClearable={false}
                onChange={e => setPaymentStatus(e.value)}
              />
            </div>
          </Col>
          <Col md="6">
            <div className='mb-1'>
              <Label className='form-label' for='status'>
                Generate E Ticket
              </Label>
              <Select
                className='react-select'
                classNamePrefix='select'
                value={trueFalseOpts.find(({ value }) => value === false)}
                options={trueFalseOpts}
                isClearable={false}
                onChange={e => setGenerateTicket(e.value)}
              />
            </div>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button className='me-1' color='primary' onClick={checkForm}>
          Submit
        </Button>
        <Button color='secondary' onClick={handleModal} outline>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default BookingEditModal
