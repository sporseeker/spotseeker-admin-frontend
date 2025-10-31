import React, { useState, useEffect, useMemo } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Button,
  Input,
  Col,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from 'reactstrap'
import { Download, MoreVertical, Edit, Trash2 } from 'react-feather'
import CustomDataTable from "@components/data-table"
import SpinnerComponent from '../../../@core/components/spinner/Fallback-spinner'
import { dummyNewEventRequests } from './constants'
import { useNavigate } from 'react-router-dom'

// ** Actions Dropdown Component
const ActionsDropdown = ({ row }) => {
  const navigate = useNavigate()

  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggle = () => setDropdownOpen(prevState => !prevState)

  const handleEdit = () => {
    navigate('/events/requests/actions')
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

const NewEventRequests = () => {
  const [eventData, setEventData] = useState([])
  const [pending, setPending] = useState(true)
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    // Using dummy data
    setEventData(dummyNewEventRequests)
    setPending(false)
  }, [])

  const columns = [
    {
      name: "Event",
      minWidth: "200px",
      sortable: true,
      selector: (row) => row.eventName
    },
    {
      name: "Event Status",
      minWidth: "120px",
      sortable: true,
      cell: (row) => {
        let backgroundColor = '#82868B' // default secondary color
        let text = 'Unknown'

        switch (row.eventStatus) {
          case 'pending':
            backgroundColor = '#FF9F43' // warning/orange
            text = 'Pending'
            break
          case 'sent back':
            backgroundColor = '#FF5722' // deep orange
            text = 'Sent Back'
            break
          case 'rejected':
            backgroundColor = '#EA5455' // danger/red
            text = 'Rejected'
            break
          default:
            backgroundColor = '#82868B'
            text = row.eventStatus || 'Unknown'
        }

        return (
          <div
            style={{
              height: '28px',
              width: '80px',
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
      minWidth: "200px",
      sortable: true,
      selector: (row) => row.organization
    },
    {
      name: "Organizer",
      minWidth: "150px",
      sortable: true,
      selector: (row) => row.organizer
    },
    {
      name: "Start Date & Time",
      minWidth: "180px",
      sortable: true,
      selector: (row) => row.startDateTime
    },
    {
      name: "End Date & Time",
      minWidth: "180px",
      sortable: true,
      selector: (row) => row.endDateTime
    },
    {
      name: "Venue",
      minWidth: "200px",
      sortable: true,
      selector: (row) => row.venue
    },
    {
      name: "",
      width: "50px",
      cell: (row) => <ActionsDropdown row={row} />
    }
  ]

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result

    const columnDelimiter = ","
    const lineDelimiter = "\n"

    const keys = Object.keys(array[0]).filter(
      (key) =>        key !== "id" &&
        key !== "created_at" &&
        key !== "updated_at"
    )

    result = ""
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach((item) => {
      let ctr = 0
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter

        result += item[key] || ""

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

    const filename = "new-event-requests.csv"

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute("href", encodeURI(csv))
    link.setAttribute("download", filename)
    link.click()
  }

  const filteredItems = eventData.filter(
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

        <div className="d-flex">
          <Col lg="12" md="12">
            <Button
              className="ms-2"
              color="primary"
              style={{ height: '39px' }}
              onClick={() => downloadCSV(eventData)}>
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

export default NewEventRequests