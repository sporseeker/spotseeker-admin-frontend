
import { useEffect, useState } from "react"
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

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import BookingService from "../../../services/BookingService"
import QueueService from "../../../services/QueueService"
import QueuedJobsTable from "./QueuedJobsTable"

const MySwal = withReactContent(Swal)

const JobsQueue = () => {

    const [jobs, setJobs] = useState()
    const [processing, setProcessing] = useState(false)

  const handleSuccess = (message) => {
    return MySwal.fire({
      title: message,
      icon: "success",
      customClass: {
        confirmButton: "btn btn-primary"
      },
      buttonsStyling: false
    })
  }

  const handleError = (message) => {
    return MySwal.fire({
      title: message,
      icon: "error",
      customClass: {
        confirmButton: "btn btn-primary"
      },
      buttonsStyling: false
    })
  }

  const handleRetryJob = (id) => {
    QueueService.retryFailedJobs(id)
    .then(() => {
      handleSuccess("Job requeued sucessfully")
    })
    .catch(() => {
      handleError("Job requeue failed")
    })
  }

  const handleStartQueue = () => {
    QueueService.restartQueue()
    .then(() => {
      handleSuccess("Queue restarted sucessfully")
    })
    .catch(() => {
      handleError("Queue restart failed")
    })
  }

  useEffect(() => {
    setProcessing(true)
    QueueService.getAllQueuedJobs()
    .then(res => {
        setJobs(res.data.data)
        setProcessing(false)
    })
    .catch(err => {
        handleError(err.response.data.message)
        setProcessing(false)
    })
  }, [])

  return (
    <div>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle tag="h4">System Queue</CardTitle>
          <code>Please contact technical team before doing anything here</code>
          <Button color="danger" onClick={handleStartQueue}>Restart Failed Jobs</Button>
        </CardHeader>
        <CardBody>
          <Row>
            
            <QueuedJobsTable data={jobs} handleRetryJob={handleRetryJob} processing={processing}/>
          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default JobsQueue
