// Sample table component for New Event Requests
import React, { useEffect, useState } from 'react'
import { Table, Button, Badge } from 'reactstrap'
import { Link } from 'react-router-dom'

const sampleData = [
  { id: 1, name: 'Summer Beats Festival', date: '2025-11-15', status: 'pending' },
  { id: 2, name: 'Autumn Jazz Night', date: '2025-12-01', status: 'accepted' },
  { id: 3, name: 'Charity Gala', date: '2026-01-20', status: 'rejected' }
]

const statusColor = (s) => {
  switch (s) {
    case 'accepted':
      return 'success'
    case 'rejected':
      return 'danger'
    case 'pending':
    default:
      return 'warning'
  }
}

const NewEventRequestsTable = ({ data }) => {
  const [rows, setRows] = useState([])

  useEffect(() => {
    // If parent supplies data, use it; otherwise fallback to sampleData
    setRows(Array.isArray(data) && data.length ? data : sampleData)
  }, [data])

  const updateStatus = (id, status) => {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, status } : r)))
  }

  return (
    <div>
      <h5 className="mb-1">New Event Requests</h5>
      <Table responsive bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>Event Name</th>
            <th>Date</th>
            <th>Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id || idx}>
              <td>{idx + 1}</td>
              <td>
                <Link to={`/events/${row.id}`}>{row.name}</Link>
              </td>
              <td>{row.date}</td>
              <td>
                <Badge color={statusColor(row.status)} pill>
                  {row.status}
                </Badge>
              </td>
              <td className="text-center">
                <Button size="sm" color="success" className="me-1" onClick={() => updateStatus(row.id, 'accepted')}>
                  Approve
                </Button>
                <Button size="sm" color="danger" className="me-1" onClick={() => updateStatus(row.id, 'rejected')}>
                  Reject
                </Button>
                <Button size="sm" color="primary" outline tag={Link} to={`/new-event-requests/action`}>
                  Actions
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default NewEventRequestsTable
