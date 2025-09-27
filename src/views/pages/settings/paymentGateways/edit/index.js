// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Input,
  Form,
  Button,
  Label
} from 'reactstrap'

import Select from 'react-select'
import { useEffect, useState } from 'react'
import PaymentService from '@services/PaymentService'
import { Alert } from '@alerts'
import { trueFalseOpts } from '@utils'
import { useParams } from 'react-router-dom'

const EditPaymentGateway = () => {
  const { id } = useParams()

  const [name, setName] = useState('')
  const [custServiceCharge, setCustServiceCharge] = useState('')
  const [applyHandlingFee, setApplyHandlingFee] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    PaymentService.getPGById(id)
      .then(res => {
        setName(res.data.data.name)
        setCustServiceCharge(res.data.data.commission_rate)
        setApplyHandlingFee(res.data.data.apply_handling_fee)
        setActive(res.data.data.active)
      })
      .catch(err => {
        Alert(err.response.data.errors, 'error')
      })
  }, [])

  const handleDropdownChange = option => {
    setActive(option.value)
  }

  const handleApplyHandlingFeeChange = option => {
    setApplyHandlingFee(option.value)
  }

  const handleSubmit = () => {
    const pgObj = {
      name,
      commission_rate: custServiceCharge,
      apply_handling_fee: applyHandlingFee,
      active
    }

    PaymentService.updatePG(pgObj, id)
      .then(() => {
        Alert('Payment Gateway Details Updated Successfully', 'success')
      })
      .catch(err => {
        Alert(err.response.data.errors, 'error')
      })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Edit Payment Gateway</CardTitle>
      </CardHeader>

      <CardBody>
        <Form>
          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                Name
              </Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="custServiceCharge">
                Customer Service Charge Rate
              </Label>
              <Input
                type="text"
                name="custServiceCharge"
                id="custServiceCharge"
                placeholder="Customer Service Charge"
                value={custServiceCharge}
                onChange={e => setCustServiceCharge(e.target.value)}
              />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="custServiceCharge">
                Apply Handling Fee If Any
              </Label>
              <Select
                name="apply_handling_fee"
                className="react-select"
                classNamePrefix="select"
                value={trueFalseOpts.find(({ value }) => value === applyHandlingFee)}
                options={trueFalseOpts}
                onChange={handleApplyHandlingFeeChange}
              />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="EmailMulti">
                Active
              </Label>
              <Select
                name="active"
                className="react-select"
                classNamePrefix="select"
                value={trueFalseOpts.find(({ value }) => value === active)}
                options={trueFalseOpts}
                onChange={handleDropdownChange}
              />
            </Col>
            <Col sm="12">
              <div className="d-flex">
                <Button
                  className="me-1"
                  color="primary"
                  type="button"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
                <Button outline color="secondary" type="reset">
                  Reset
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  )
}
export default EditPaymentGateway
