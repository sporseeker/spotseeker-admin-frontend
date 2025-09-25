// ** React Imports

// ** Third Party Components
import { X } from 'react-feather'

// ** Reactstrap Imports
import { Modal, Input, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText, ModalFooter, Row, Col, Badge } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { getStatus } from '../../../../utility/Utils'

const BookingViewModal = ({ open, handleModal, booking }) => {

  // ** Custom close btn
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />

  const statusBadge = getStatus(booking.payment_status)
  return (
    <Modal
      isOpen={open}
      toggle={handleModal}
      className='modal-dialog-centered modal-lg'
      contentClassName='pt-0'
    >
      <ModalHeader className='mb-1' toggle={handleModal} close={CloseBtn} tag='div'>
        <h5 className='modal-title'>Booking #{booking.order_id}&nbsp;&nbsp;&nbsp;{statusBadge}</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
        <Row>
          <Col md="6">
            <div className='mb-1'>
              <Label className='form-label' for='full-name'>
                Order ID
              </Label>
              <Input id='full-name' placeholder='' value={booking.order_id}/>
            </div>
            <div className='mb-1'>
              <Label className='form-label' for='full-name'>
                Payment Ref
              </Label>
              <Input id='full-name' placeholder='' value={booking.payment_ref_no}/>
            </div>
            <div className='mb-1'>
              <Label className='form-label' for='full-name'>
                Date
              </Label>
              <Input id='full-name' placeholder='' value={booking.date}/>
            </div>
            <div className='mb-1'>
              <Label className='form-label' for='full-name'>
                Package x Tickets
              </Label><br/>
              <Row>
                <Col md="6">
                  <Input id='full-name' placeholder='' value={booking.package_name}/>
                </Col>{"X"}
                <Col md="5">
                  <Input id='full-name' placeholder='' value={booking.package_tickets}/>
                </Col>
              </Row>
              
            </div>
            <div className='mb-1'>
              <Label className='form-label' for='full-name'>
                Seats No(s)
              </Label>
              <Input id='full-name' placeholder='' value={Array.isArray(booking.package_seat_nos) ? booking.package_seat_nos.join(",") : ""}/>
            </div>
          </Col>
          <Col md="6">
            <div className='mb-1'>
              <Label className='form-label' for='full-name'>
                Customer Name
              </Label>
              <Input id='full-name' placeholder='' value={booking.cust_name}/>
            </div>
            <div className='mb-1'>
              <Label className='form-label' for='full-name'>
                Customer Email
              </Label>
              <Input id='full-name' placeholder='' value={booking.cust_email}/>
            </div>
            <div className='mb-1'>
              <Row>
                <Col md="6">
                <Label className='form-label' for='full-name'>
                Customer Phone
              </Label>
              <Input id='full-name' placeholder='' value={booking.cust_phone}/>
                </Col>
                <Col md="6">
                <Label className='form-label' for='full-name'>
                Customer NIC
              </Label>
              <Input id='full-name' placeholder='' value={booking.cust_nic}/>
                </Col>
              </Row>
            </div>
            <div className='mb-1'>
              <Label className='form-label' for='full-name'>
                Total Amount
              </Label>
              <Input id='full-name' placeholder='' value={booking.tot_amount?.toFixed(2)}/>
            </div>
            <div className='mb-1'>
              <Label className='form-label' for='full-name'>
                Comment
              </Label>
              <Input id='comment' placeholder='' value={booking.comment} type="textarea"/>
            </div>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  )
}

export default BookingViewModal
