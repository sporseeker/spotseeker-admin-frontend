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
  Label,
  CardFooter
} from "reactstrap"

import Select from "react-select"
import { useEffect, useState } from "react"
import EventService from "@services/EventService"
import DataTable from "react-data-table-component"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import { Download } from "react-feather"
import { Alert } from "@alerts"
import SpinnerComponent from "../../../@core/components/spinner/Fallback-spinner"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

const SendInvitations = () => {
  const [selectedEvent, setSelectedEvent] = useState()
  const [events, setEvents] = useState([])
  const [excelData, setExcelData] = useState([])
  const [columns, setColumns] = useState([])
  const [pending, setPending] = useState(true)

  const handleDropdownChange = (option) => {
    setSelectedEvent(option.value)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (event) => {
      const binaryString = event.target.result
      const workbook = XLSX.read(binaryString, { type: "binary" })

      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]

      const data = XLSX.utils.sheet_to_json(sheet)
      setExcelData(data)

      if (data.length > 0) {
        const cols = Object.keys(data[0]).map((key) => ({
          name: key,
          selector: key
        }))
        setColumns(cols)
      }
    }

    reader.readAsBinaryString(file)
  }

  useEffect(() => {
    EventService.getAllEvents(['ongoing', 'closed']).then((res) => {
      const eventObjs = res.data.data
      eventObjs.map((event) => {
        const eventObj = {
          value: event.id,
          label: event.name
        }
        setEvents((events) => [...events, eventObj])
      })
      setPending(false)
    })
  }, [])

  const downloadSampleExcel = () => {
    const wb = XLSX.utils.book_new()
    const wsData = [
      { Name: "John Doe", Email: "john.doe@example.com", Package: "VIP", Tickets: 1, SeatNos: "A1,B2" },
      { Name: "Jane Smith", Email: "jane.smith@example.com", Package: "VVIP", Tickets: 5, SeatNos: "AF1,B25" }
    ]
    const ws = XLSX.utils.json_to_sheet(wsData)
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" })
    const buf = new ArrayBuffer(wbout.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i < wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xff
    saveAs(new Blob([buf], { type: "application/octet-stream" }), "invitee_list.xlsx")
  }

  const handleRenderHtml = (errors) => {
    return (
      <>
        <Row>
          <Col md="12">
            <ul style={{ textAlign: "left", fontSize: 18, textDecoration: "none" }}>
              {/* Display 'invites_already_sent' errors if present */}
              {errors.invites_already_sent && Array.isArray(errors.invites_already_sent) && errors.invites_already_sent.length > 0 && (
                <>
                  <li>
                    <strong>Invitations already sent to:</strong>
                    <ul>
                      {errors.invites_already_sent.map((email, index) => (
                        <li key={`invites_already_sent-${index}`}>
                          <span>{email}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                </>
              )}

              {errors.invites_send > 0 && (
                <>
                  <li>
                    <strong>Invitations sent to:<span>{errors.invites_send} invitees</span></strong>
                  </li>
                </>
              )}
  
              {/* Display any other errors generically */}
              {Object.keys(errors).map((field) => {
                const error = errors[field]
                if (field !== 'invites_already_sent' && Array.isArray(error)) {
                  return error.map((errMsg, index) => (
                    <li key={`${field}-${index}`}>
                      <span>{errMsg}</span>
                    </li>
                  ))
                } else if (field !== 'invites_already_sent' && typeof error === 'string') {
                  return (
                    <li key={`${field}`}>
                      <span>{error}</span>
                    </li>
                  )
                }
                return null
              })}
            </ul>
          </Col>
        </Row>
      </>
    )
  }
  
  const handleError = (err) => {
    return MySwal.fire({
      title: err.response.data.message,
      icon: "error",
      iconColor: 'white',
      html: handleRenderHtml(err.response.data.errors),
      customClass: {
        confirmButton: "btn btn-lg btn-success",
        popup: 'colored-toast',
        title: 'qr-modal',
        htmlContainer: 'qr-scan-details'
      },
      buttonsStyling: false
    })
  }
  
  const handleSend = () => {
    EventService.sendInvitations({ event_id: selectedEvent, invitees: excelData })
      .then(() => {
        Alert('Invitation sent successfully', 'success')
      })
      .catch(err => {
        if (Object.keys(err.response.data.errors).length > 0) {
          handleError(err)
        } else {
          Alert(err.response.data.message, 'error')
        }
      })
  }
  

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Send invitation</CardTitle>
      </CardHeader>

      { pending ? <SpinnerComponent/> : <CardBody>
        <Form>
          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="EmailMulti">
                Select Event
              </Label>
              <Select
                name="role"
                className="react-select"
                classNamePrefix="select"
                options={events}
                onChange={handleDropdownChange}
                isLoading={pending}
              />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="EmailMulti">
                Choose invitee list excel file
              </Label>&nbsp;
              (<a onClick={downloadSampleExcel} style={{color: "red", fontSize: 12}}><Download size={12}/> Download Sample Excel</a>)
              <Input
                type="file"
                name="thumbnail_img"
                onChange={handleFileUpload}
              />
            </Col>
          </Row>
          <div className="react-dataTable">
            {excelData.length > 0 && (
              <DataTable
                title="Invitee List"
                columns={columns}
                data={excelData}
                pagination
              />
            )}
          </div>
        </Form>
      </CardBody> }
      <CardFooter>
        <Button color="success" disabled={!excelData.length > 0} onClick={() => handleSend()}>Send</Button>
      </CardFooter>
    </Card>
  )
}
export default SendInvitations
