// ** Reactstrap Imports
import { useEffect, useState } from "react"
import { useImmer } from "use-immer"
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
import VenueService from "../../../../services/VenueService"
import { Alert } from "../../../../utility/alerts"
import { useParams } from "react-router-dom"

const VenueCreate = () => {
  const { type, id } = useParams()

  const [venue, setVenueData] = useImmer({
    name: "",
    location_url: ""
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (type === "edit") {
      setLoading(true)
      VenueService.getVenue(id)
        .then((res) => {
          console.log(res)
          setVenueData(res.data.data)
          setLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
    }
  }, [])

  const handleReset = () => {
    setVenueData({
      name: "",
      location_url: ""
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setVenueData((venue) => {
      venue[name] = value
    })
  }

  const handleSubmit = () => {
    setLoading(true)
    if (type === "edit") {
      VenueService.updateVenue(venue, id)
        .then((res) => {
          Alert(res.data.message.toUpperCase(), "success")
          setLoading(false)
          setVenueData(res.data.data)
        })
        .catch((err) => {
          Alert(err.response.data.message.toUpperCase(), "error")
          setLoading(false)
        })
    } else if (type === "create") {
      VenueService.createVenue(venue)
        .then((res) => {
          Alert(res.data.message, "success")
          setLoading(false)
          handleReset()
        })
        .catch((err) => {
          Alert(err.response.data.message.toUpperCase(), "error")
          setLoading(false)
        })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">
          {type === "edit" ? "Edit" : "Create"} Venue
        </CardTitle>
      </CardHeader>

      <CardBody>
        <Form>
          <Row>
            <Col sm="12" className="mb-1">
              <Label className="form-label" for="venue-name">
                Name
              </Label>
              <Input
                type="text"
                name="name"
                id="venue-name"
                placeholder="Name"
                value={venue.name}
                onChange={handleChange}
              />
            </Col>
            <Col sm="12" className="mb-1">
              <Label className="form-label" for="venue-name">
                Location URL
              </Label>
              <Input
                type="text"
                name="location_url"
                id="venue-location-url"
                placeholder="Location URL"
                value={venue.location_url}
                onChange={handleChange}
              />
            </Col>
            <Col sm="12">
              <div className="d-flex">
                <Button
                  className="me-1"
                  color="primary"
                  type="button"
                  onClick={handleSubmit}>
                  {loading ? "Processing..." : "Submit"}
                </Button>
                <Button
                  outline
                  color="secondary"
                  type="button"
                  onClick={handleReset}>
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
export default VenueCreate
