// ** Icons Imports
import { MoreVertical, Edit, Trash, Repeat } from 'react-feather'

// ** Reactstrap Imports
import { Table, Badge, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'
import { getStatus } from '../../../utility/Utils'

const QueuedJobsTable = ({data, processing}) => {
  return (
    <Table striped responsive>
      <thead>
        <tr>
          <th>UUID</th>
          <th>Queue</th>
          <th>Status</th>
          <th>Failed At</th>
          <th>Payload</th>
          <th>Exception</th>
        </tr>
      </thead>
      <tbody>
        {
          !processing ? data?.map(job => {
            return (
              <tr>
                <td>{job.uuid}</td>
                <td>{job.queue}</td>
                <td>{getStatus(job.status)}</td>
                <td>{job.failed_at}</td>
                <td><code>{job.payload.substring(0, 50)}</code></td>
                <td><code>{job.exception.substring(0, 105)}</code></td>
              </tr>
            )
          }) : <tr>Loading...</tr>
        }
        
      </tbody>
    </Table>
  )
}

export default QueuedJobsTable
