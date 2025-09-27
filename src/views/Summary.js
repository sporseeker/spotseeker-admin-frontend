import { Fragment, useEffect, useState } from "react"
import { Col, Row } from "reactstrap"
import SalesService from "../services/SalesService"
import ToastSucess from "../components/alerts/index"
import EventService from "../services/EventService"
import CardMeetup from "@src/views/ui-elements/cards/advance/CardMeetup"
import "@styles/base/pages/dashboard-ecommerce.scss"
import SpinnerComponent from "../@core/components/spinner/Fallback-spinner"
const Summary = () => {
  const [salesData, setData] = useState([])
  const [eventsArr, setEventsDataArr] = useState([])
  const [pending, setPending] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setPending(true)
    EventService.getAllEvents()
      .then((eventRes) => {
        setProgress(50)
        SalesService.getAllSales()
          .then((res) => {
            setProgress(75)
            const data = res.data.data
            const sales_arr = []
            data.map((sale) => {
              const event_id = sale.event_id
              const event_name = sale.event_name
              const ticket_category = sale.package
              const capacity = sale.tot_tickets
              const ticket_price = parseFloat(sale.package_price).toFixed(2)
              const reserved_tickets = sale.res_tickets
              const allocated_tickets = sale.aval_tickets
              const sold_tickets =
                sale.sold_tickets !== null ? sale.sold_tickets : 0
              const sold_amount = parseFloat(
                sold_tickets * ticket_price
              ).toFixed(2)
              const sold_percentage = `${(
                (sold_tickets / capacity) *
                100
              ).toFixed(0)}%`
              const addon_sales = sale.addons

              const sales_obj = {
                event_id,
                event_name,
                ticket_category,
                capacity,
                ticket_price,
                reserved_tickets,
                allocated_tickets,
                sold_tickets,
                sold_amount,
                sold_percentage,
                addon_sales
              }

              sales_arr.push(sales_obj)
            })
            setData(sales_arr)
            setEventsDataArr(eventRes.data.data)
            setPending(false)
            setProgress(100)
          })
          .catch((err) => {
            setPending(false)
            ToastSucess("Something went wrong", err.message)
          })
      })
      .catch((err) => {
        setPending(false)
        ToastSucess("Something went wrong", err.message)
      })
  }, [])

  return (
    <Fragment>
      { pending ? <SpinnerComponent progress={progress}/> : <Row className="match-height">
        {eventsArr.map((event) => (
          <Col xl="4" md="3" xs="12">
            <CardMeetup
              upComingEvent={event}
              key={event.id}
              salesData={salesData}
            />
          </Col>
        ))}
      </Row> }
    </Fragment>
  )
}

export default Summary
