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
import { Alert } from "../../../../utility/alerts"
import { useParams } from "react-router-dom"

import Select from "react-select/async"
import Flatpickr from "react-flatpickr"
import "@styles/react/libs/flatpickr/flatpickr.scss"

import NotificationService from "../../../../services/NotificationService"
import EventService from "../../../../services/EventService"
import { eventStatuses } from "../../../../utility/Utils"

const NotificationCreate = () => {
  const { type, id } = useParams()

  const [notification, setNotificationData] = useImmer({
    message: "",
    scheduled_at: "",
    events: []
  })
  const [loading, setLoading] = useState(false)
  const [Events, setEvents] = useState([])
  const [eventsPending, setEventsPending] = useState(true)

  useEffect(() => {
    if (type === "edit") {
      setLoading(true)
      NotificationService.getNotification(id)
        .then((res) => {
          console.log(res)
          setNotificationData(res.data.data)
          setLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
    }
  }, [])

  const fetchEvents = async (status, limit, name, search, all) => {
    try {
      const res = await EventService.getAllEvents(
        status,
        limit,
        name,
        search,
        all
      )
      return res.data.data
    } catch (error) {
      console.error("Error fetching events:", error)
      throw error
    }
  }

  const filterColors = async (inputValue) => {
    setEventsPending(true)

    try {
      const events = await fetchEvents(
        eventStatuses.map((event) => event.value),
        null,
        null,
        inputValue,
        false
      )

      const eventOptions = events.map((event) => ({
        value: event.id,
        label: event.name
      }))

      setEvents(eventOptions)

      return eventOptions
    } catch (error) {
      console.error("Error filtering events:", error)
      return []
    } finally {
    }
  }

  const promiseOptions = (inputValue) => {
    return filterColors(inputValue)
  }

  const handleReset = () => {
    setVenueData({
      message: "",
      scheduled_at: "",
      events: []
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNotificationData((notification) => {
      notification[name] = value
    })
  }

  const handleScheduleDateChange = (date) => {
    setNotificationData((prevState) => ({
      ...prevState,
      scheduled_at: date
    }))
  }

  const handleSubmit = () => {
    setLoading(true)
    if (type === "edit") {
      NotificationService.updateNotification(notification, id)
        .then((res) => {
          Alert(res.data.message.toUpperCase(), "success")
          setLoading(false)
        })
        .catch((err) => {
          Alert(err.response.data.message.toUpperCase(), "error")
          setLoading(false)
        })
    } else if (type === "create") {
      NotificationService.scheduleNotification(notification)
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

  const handleDropdownChange = (selectedOption, action) => {
    let selectedValues = null
    console.log(selectedOption, action)
    // Check if selectedOption is an array (indicating multiple selections)
    if (Array.isArray(selectedOption)) {
      selectedValues = selectedOption.map((option) => option.value)
    } else {
      // For single selection, directly extract the value
      if (action.name === "coordinators") {
        selectedValues = selectedOption ? [selectedOption.value] : []
      } else {
        selectedValues = selectedOption ? selectedOption.value : null
      }
    }

    setNotificationData((prevState) => ({
      ...prevState,
      [action.name]: selectedValues
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">
          {type === "edit" ? "Edit" : "Create"} Notification
        </CardTitle>
      </CardHeader>

      <CardBody>
        <Form>
          <Row>
            <Col sm="12" className="mb-1">
              <Label className="form-label" for="notif-name">
                Message
              </Label>
              <Input
                type="textarea"
                name="message"
                id="notif-name"
                placeholder="Message"
                value={notification.message}
                onChange={handleChange}
              />
            </Col>
            <Col sm="12" className="mb-1">
              <Label className="form-label" for="scheduled-at">
                Schedule At
              </Label>
              <Flatpickr
                data-enable-time
                id="end-date-time"
                name="scheduled_at"
                className="form-control"
                value={notification.scheduled_at}
                onChange={(date, dateStr) => handleScheduleDateChange(dateStr)}
                options={{
                  dateFormat: "Y-m-d H:i",
                  minDate: "today"
                }}
              />
            </Col>
            <Col md="12" className="mb-1">
              <Label className="form-label" for="coordinators">
                Target Users Who Bought Tickets From:
              </Label>
              <Select
                name="events"
                className="react-select"
                classNamePrefix="select"
                isClearable={false}
                onChange={handleDropdownChange}
                cacheOptions
                defaultOptions
                loadOptions={promiseOptions}
                isLoading={eventsPending}
                isMulti
                styles={{
                  multiValue: (styles) => ({
                    ...styles,
                    color: "white",
                    backgroundColor: "#7367F0"
                  })
                }}
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
export default NotificationCreate
