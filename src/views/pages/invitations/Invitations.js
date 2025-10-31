// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Col,
  Button,
  Row,
  CardDeck,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap"
// import Select from "react-select"
import { useEffect, useMemo, useState } from "react"
// import EventService from "@services/EventService"
// import { Link } from "react-router-dom"
// import { getStatus } from "@utils"
import { Download, MoreVertical, Edit, Trash2 } from "react-feather"
// import { Download, Mail } from "react-feather"
import SpinnerComponent from "../../../@core/components/spinner/Fallback-spinner"
// import { dummyEvents, dummyInvitations } from "./constants"
import { dummyInvitations } from "./constants"
import CustomDataTable from "@components/data-table"


const ActionsDropdown = ({ row }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggle = () => setDropdownOpen(prevState => !prevState)

  const handleEdit = () => {
    console.log('Edit clicked for row:', row)
    // Add edit logic here
  }

  const handleDelete = () => {
    console.log('Delete clicked for row:', row)
    // Add delete logic here
  }

  return (
    <div style={{ width: '50px', display: 'flex', justifyContent: 'center' }}>
      <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="left">
        <DropdownToggle
          tag="div"
          style={{
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px'
          }}
        >
          <MoreVertical size={20} color="#000000" />
        </DropdownToggle>
        <DropdownMenu style={{ minWidth: '120px', width: '100%' }}>
          <DropdownItem 
            onClick={handleEdit}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              width: '100%',
              padding: '8px 12px'
            }}
          >
            <Edit size={14} style={{ marginRight: '8px' }} />
            Edit
          </DropdownItem>
          <DropdownItem 
            onClick={handleDelete}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              width: '100%',
              padding: '8px 12px'
            }}
          >
            <Trash2 size={14} style={{ marginRight: '8px' }} />
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

const Invitations = () => {
  // const [events, setEvents] = useState([])
  const [invData, setInvData] = useState([])
  const [pending, setPending] = useState(true)
  const [filterText, setFilterText] = useState("")

  // ** Date formatting function
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return `${date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    })} at ${date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })}`
  }

  useEffect(() => {
    // Commented out API integration for dummy data
    // setPending(true)
    // EventService.getAllEvents()
    //   .then((res) => {
    //     const eventObjs = res.data.data
    //     eventObjs.map((event) => {
    //       const eventObj = {
    //         value: event.id,
    //         label: event.name
    //       }
    //       setEvents((events) => [...events, eventObj])
    //     })

    //     EventService.getInvitations(res.data.data[0].id)
    //       .then((res) => {
    //         setInvData(res.data.data.invitations)
    //         setPending(false)
    //       })
    //       .catch((err) => {
    //         console.log(err)
    //         setPending(false)
    //       })
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //     setPending(false)
    //   })

    // Using dummy data
    // const eventObjs = dummyEvents.map((event) => ({
    //   value: event.id,
    //   label: event.name
    // }))
    // setEvents(eventObjs)
    setInvData(dummyInvitations)
    setPending(false)
  }, [])

  const columns = [
    {
      name: "Event",
      minWidth: "200px",
      sortable: true,
      selector: (row) => row.event.name
    },
    {
      name: "Featured",
      minWidth: "100px",
      sortable: true,
      cell: (row) => (
        <div
          style={{
            height: '28px',
            width: '41px',
            backgroundColor: row.featured ? '#28C76F' : '#EB5C5D',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            fontFamily: 'Roboto Condensed, sans-serif',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {row.featured ? 'Yes' : 'No'}
        </div>
      )
    },
    {
      name: "Status",
      minWidth: "100px",
      sortable: true,
      cell: (row) => {
        let backgroundColor = '#82868B' // default secondary color
        let text = 'Unknown'

        switch (row.status) {
          case 'draft':
            backgroundColor = '#6C757D' // gray
            text = 'Draft'
            break
          case 'pending':
            backgroundColor = '#FF9F43' // warning/orange
            text = 'Pending'
            break
          case 'ongoing':
            backgroundColor = '#EB5C5D' 
            text = 'Ongoing'
            break
          case 'complete':
            backgroundColor = '#28C76F' 
            text = 'Complete'
            break
          case 'presale':
            backgroundColor = '#82868B' 
            text = 'Pre Sale'
            break
          case 'soldout':
            backgroundColor = '#EA5455' 
            text = 'Sold Out'
            break
          case 'cancelled':
            backgroundColor = '#82868B' 
            text = 'Cancelled'
            break
          case 'closed':
            backgroundColor = '#FF9F43' 
            text = 'Closed'
            break
          case 'postponed':
            backgroundColor = '#EA5455' 
            text = 'Postponed'
            break
          default:
            backgroundColor = '#82868B'
            text = row.status || 'Unknown'
        }

        return (
          <div
            style={{
              height: '28px',
              width: '68px',
              backgroundColor,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              fontFamily: 'Roboto Condensed, sans-serif',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {text}
          </div>
        )
      }
    },
    {
      name: "Organization",
      minWidth: "150px",
      sortable: true,
      selector: (row) => row.organization || "N/A"
    },
    {
      name: "Organizer",
      minWidth: "150px",
      sortable: true,
      selector: (row) => row.organizer || "N/A"
    },
    {
      name: "Start Date & Time",
      minWidth: "180px",
      sortable: true,
      selector: (row) => formatDateTime(row.startDateTime)
    },
    {
      name: "End Date & Time",
      minWidth: "180px",
      sortable: true,
      selector: (row) => formatDateTime(row.endDateTime)
    },
    {
      name: "Venue",
      minWidth: "150px",
      sortable: true,
      selector: (row) => row.venue || "N/A"
    },
    {
      name: "",
      width: "50px",
      cell: (row) => <ActionsDropdown row={row} />
    }
  ]

  // const handleEventChange = (e) => {
  //   // Commented out API integration
  //   // setPending(true)
  //   // const value = e.value

  //   // EventService.getInvitations(value)
  //   //   .then((res) => {
  //   //     setInvData(res.data.data.invitations)
  //   //     setPending(false)
  //   //   })
  //   //   .catch((err) => {
  //   //     console.log(err)
  //   //     setPending(false)
  //   //   })

  //   // Using dummy data
  //   const value = e.value
  //   const filteredInvitations = dummyInvitations.filter(inv => inv.event.id === value)
  //   setInvData(filteredInvitations)
  // }

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result

    const columnDelimiter = ","
    const lineDelimiter = "\n"

    const keys = Object.keys(array[0]).filter(
      (key) =>        key !== "user_id" &&
        key !== "event_id" &&
        key !== "id" &&
        key !== "created_at" &&
        key !== "updated_at"
    )

    keys.push("user_email")

    result = ""
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach((item) => {
      let ctr = 0
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter

        // Check if the current key is 'manager.name', if so, extract the nested value
        if (key === "user") {
          result += item.user.name || "" // Use empty string if manager.name is null or undefined
        } else if (key === "event") {
          result += item.event.name || ""
        } else if (key === "invitation_id") {
          result += item.invitation_id || ""
        } else if (key === "status") {
          result += item.status || ""
        } else if (key === "status") {
          result += item.status || ""
        } else if (key === "tickets_count") {
          result += item.tickets_count || ""
        } else if (key === "user_email") {
          result += item.user.email || ""
        }

        ctr++
      })
      result += lineDelimiter
    })

    return result
  }

  // ** Downloads CSV
  function downloadCSV(array) {
    const link = document.createElement("a")
    let csv = convertArrayOfObjectsToCSV(array)
    if (csv === null) return

    const filename = "export.csv"

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute("href", encodeURI(csv))
    link.setAttribute("download", filename)
    link.click()
  }

  const filteredItems = invData.filter(
    item => JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !== -1
  )

  const subHeaderComponent = useMemo(() => {

    return (
      <div style={{ textAlign: 'left', width: '100%', marginTop: '20px' }}>
        <div style={{ 
          fontFamily: 'Roboto Condensed, sans-serif',
          color: '#6A6775',
          fontSize: '14px',
          fontWeight: 'normal',
          marginBottom: '1px'
        }}>
          Search:
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', justifyContent: 'flex-start' }}>
          <Col md="4" style={{ padding: 0 }}>
            <Input
              id="search"
              type="text"
              placeholder=""
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
            />
          </Col>
          <Button
            style={{ 
              height: '40px', 
              width: '77px',
              borderRadius: '4px',
              backgroundColor: '#82868B',
              border: 'none',
              fontFamily: 'Roboto Condensed, sans-serif',
              fontSize: '16px',
              fontWeight: 'normal',
              color: '#FFFFFF',
              padding: 0
            }}
            onClick={() => setFilterText('')}
          >
            Reset
          </Button>
        </div>
      </div>
    )
  }, [filterText])

  return (
    <Card style={{ borderRadius: '5px' }}>
      <CardHeader className="border-bottom" style={{ paddingTop: '27px', paddingBottom: '23px', height: '89px' }}>
        <CardTitle 
          style={{
            fontFamily: 'Roboto Condensed, sans-serif',
            color: '#6A6775',
            fontSize: '20px',
            fontWeight: '500',
            height: '39px',
            display: 'flex',
            alignItems: 'center',
            margin: 0
          }}
        >
          Events List
        </CardTitle>
        {/* <Col lg="6" md="6" className="mb-1">
          <Select
            className="react-select"
            classNamePrefix="select"
            options={events}
            isClearable={false}
            defaultValue={events[0]}
            onChange={handleEventChange}
            isLoading={pending}
          />
        </Col> */}

        <div className="d-flex">
          <Col lg="12" md="12">
            <Button
              className="ms-2"
              color="primary"
              style={{ height: '39px' }}
              onClick={() => downloadCSV(invData)}>
              <Download 
                size={18} 
                style={{ 
                  color: window.innerWidth <= 576 ? '#EA5455' : '#FFFFFF' 
                }} 
              />
              <span 
                className="align-middle ms-50 d-none d-sm-inline"
                style={{
                  fontFamily: 'Roboto Condensed, sans-serif',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Download CSV
              </span>
            </Button>
            {/* <Link to={"/events/send/invitations"}>
              <Button color="success" className="ms-2">
                <Mail size={15} />
                <span className="align-middle ms-50">Send Invitations</span>
              </Button>
            </Link> */}
          </Col>
        </div>
      </CardHeader>
      <CardBody style={{ padding: '1px' }}>
        <CustomDataTable
          columns={columns}
          data={filteredItems}
          pagination
          progressPending={pending}
          progressComponent={<SpinnerComponent />}
          subHeader
          subHeaderComponent={subHeaderComponent}
        />
      </CardBody>
    </Card>
  )
}
export default Invitations
