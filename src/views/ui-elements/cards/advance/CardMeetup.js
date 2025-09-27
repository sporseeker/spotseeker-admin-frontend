// ** Custom Components
import Avatar from "@components/avatar"
import AvatarGroup from "@components/avatar-group"

// ** Icons Imports
import { Box, Calendar, DollarSign, MapPin } from "react-feather"

// ** Reactstrap Imports
import { Card, CardTitle, CardBody, CardText, CardFooter } from "reactstrap"

import { formatNumber } from "@utils"

const CardMeetup = ({ upComingEvent, salesData }) => {
  // Calculate total earnings
  const eventSales = salesData.filter((sale) => sale.event_id === upComingEvent.id)
  const totalEarnings = eventSales.reduce((sum, pkg) => sum + (pkg.sold_tickets * pkg.ticket_price), 0)
  
  // Calculate total tickets
  /*const totalTickets = eventSales.reduce((sum, pkg) => {
    return {
      capacity: sum.capacity + Number(pkg.capacity),
      soldTickets: sum.soldTickets + Number(pkg.sold_tickets),
      availableTickets: sum.availableTickets + Number(pkg.allocated_tickets)
    }
  }, { capacity: 0, soldTickets: 0, availableTickets: 0 })*/

  return (
    <Card className="card-developer-meetup">
      <div className="meetup-img-wrapper rounded-top text-center">
        <img src={upComingEvent.banner_img} height="170" alt="Meetup Banner" />
      </div>
      {upComingEvent ? (
        <>
          <CardBody>
            <div className="meetup-header d-flex align-items-center">
              <div className="my-auto">
                <CardTitle tag="h4" className="mb-25">
                  {upComingEvent.name}
                </CardTitle>
              </div>
            </div>
            <small>Packages</small>
            {eventSales.length > 0 ? eventSales.map((pkg) => (
              <div key={pkg.ticket_category}>
                <hr />
                <div className="d-flex">
                  <Avatar
                    color="light-primary"
                    className="rounded me-1"
                    icon={<Box size={18} />}
                  />
                  <div>
                    <h6 className="mb-0">{pkg.ticket_category} ( {formatNumber(Number(pkg.ticket_price))} LKR )</h6>
                    <small>Total Tickets: {pkg.capacity}</small> |{" "}
                    <small>Sold Tickets: {pkg.sold_tickets}</small> |{" "}
                    <small>Avail. Tickets: {pkg.allocated_tickets}</small> |{" "}
                    <small>Sold Amount: {formatNumber((Number(pkg.sold_tickets) * Number(pkg.ticket_price)).toFixed(2))} LKR</small>
                  </div>
                </div>
              </div>
            )) : <h6 className="mb-0">No sales recorded yet. Package statistics will be available after the first sale.</h6>}
          </CardBody>
          <CardFooter className="bg-dark text-light">
            <div className="d-flex align-items-center">
              <Avatar
                color="light-primary"
                className="rounded me-1"
                icon={<DollarSign size={18} />}
              />
              <div>
              <h6 className="mb-0 text-light">Total Earnings: {formatNumber(Number(totalEarnings))} LKR</h6>
              </div>
            </div>
          </CardFooter>
        </>
      ) : (
        <CardBody>
          <h6 className="mb-0">Something went wrong</h6>
        </CardBody>
      )}
    </Card>
  )
}

export default CardMeetup