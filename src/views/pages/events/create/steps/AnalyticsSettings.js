// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Label,
  Card,
  CardHeader,
  CardBody
} from 'reactstrap'

// ** Icons
import { Plus, Trash2 } from 'react-feather'

const AnalyticsSettings = ({ productData, setAnalytics }) => {
  // Local state to safely manage analytics rows
  const [analytics, setLocalAnalytics] = useState([])

  // Initialize local state when productData changes
  useEffect(() => {
    console.log(productData.analytics_ids)
    setLocalAnalytics(productData.analytics_ids || [])
  }, [productData.analytics_ids])

  const handleChange = (index, field, value) => {
    const updated = analytics.map((item, i) => {
      return i === index ? { ...item, [field]: value } : item
    })

    setLocalAnalytics(updated)
    setAnalytics(updated)
  }

  const handleAddRow = () => {
    const updated = [...analytics, { platform: 'gtagId', pixel_code: '' }]
    setLocalAnalytics(updated)
    setAnalytics(updated)
  }

  const handleRemoveRow = index => {
    const updated = analytics.filter((_, i) => i !== index)
    setLocalAnalytics(updated)
    setAnalytics(updated)
  }

  console.log(productData.analytics_ids)
  return (
    <Fragment>
      <Card>
        <CardHeader>
          <h4>Analytics IDs</h4>
        </CardHeader>
        <CardBody>
          <Form>
            {analytics.map((item, index) => (
              <Row className="mb-2" key={index}>
                <Col md="5">
                  <Label className="form-label" for={`platform_${index}`}>
                    Platform
                  </Label>
                  <Input
                    type="select"
                    id={`platform_${index}`}
                    name={`platform_${index}`}
                    value={item.platform}
                    onChange={e => handleChange(index, 'platform', e.target.value)
                    }
                  >
                    <option
                      value="gtagId"
                      disabled={analytics.some(
                        (a, i) => a.platform === 'gtagId' && i !== index
                      )}
                    >
                      Google
                    </option>
                    <option
                      value="fbPixelId"
                      disabled={analytics.some(
                        (a, i) => a.platform === 'fbPixelId' && i !== index
                      )}
                    >
                      Facebook
                    </option>
                  </Input>
                </Col>

                <Col md="5">
                  <Label className="form-label" for={`pixel_code_${index}`}>
                    Pixel Code
                  </Label>
                  <Input
                    type="text"
                    id={`pixel_code_${index}`}
                    name={`pixel_code_${index}`}
                    placeholder="Enter Pixel / Tracking ID"
                    value={item.pixel_code}
                    onChange={e => handleChange(index, 'pixel_code', e.target.value)
                    }
                  />
                </Col>

                <Col
                  md="2"
                  className="d-flex align-items-end justify-content-start"
                >
                  <Button
                    color="danger"
                    type="button"
                    onClick={() => handleRemoveRow(index)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </Col>
              </Row>
            ))}

            {analytics.length < 2 && <Button
              color="primary"
              type="button"
              className="mt-1"
              onClick={handleAddRow}
            >
              <Plus size={14} className="me-50" />
              Add Analytics
            </Button> }
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default AnalyticsSettings
