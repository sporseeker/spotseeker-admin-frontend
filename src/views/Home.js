// ** React Imports
import { useContext, useEffect, useState } from "react"

// ** Reactstrap Imports
import { Row, Col } from "reactstrap"

// ** Context
import { ThemeColors } from "@src/utility/context/ThemeColors"

import { Activity, Loader, X, BookOpen, Key, DollarSign } from "react-feather"

// ** Demo Components
import StatsCard from "@src/views/ui-elements/cards/statistics/StatsCard"

// ** Styles
import "@styles/react/libs/charts/apex-charts.scss"
import "@styles/base/pages/dashboard-ecommerce.scss"
import "@styles/react/libs/charts/recharts.scss"

// ** Services
import StatsService from "../services/StatsService"
import Skeleton from "react-loading-skeleton"
import TSaleByDateLineChart from "./charts/TSaleByDateLineChart"
import SpinnerComponent from "../@core/components/spinner/Fallback-spinner"
import PieChartComponent from "./charts/SalesPieChart"
import Summary from "./Summary"
const Home = () => {
  // ** Context
  const { colors } = useContext(ThemeColors)

  // ** vars
  const [pending, setPending] = useState(false)
  const [statData, setStatData] = useState([])
  //const [totSalesFigureLKR, setTotSalesFigureLKR] = useState()
  //const [totSalesFigureUSD, setTotSalesFigureUSD] = useState()
  //const [onGoingEvents, setOnGoingEvents] = useState([])
  //const [onGoingEventsSales, setOnGoingEventsSales] = useState([])
  const [salesByDate, setSalesByDate] = useState([])

  const createStat = (statName, statValue) => {
    switch (statName) {
      case "on_going_events":
        return {
          title: statValue,
          subtitle: "On Going Events",
          color: "light-primary",
          icon: <Activity size={24} />
        }
        break
      case "up_coming_events":
        return {
          title: statValue,
          subtitle: "Up Coming Events",
          color: "light-warning",
          icon: <Loader size={24} />
        }
        break
      case "sold_out_events":
        return {
          title: statValue,
          subtitle: "Sold Out Events",
          color: "light-primary",
          icon: <DollarSign size={24} />
        }
        break
      case "closed_events":
        return {
          title: statValue,
          subtitle: "Sales Closed Events",
          color: "light-primary",
          icon: <X size={24} />
        }
        break
      case "postponed_events":
        return {
          title: statValue,
          subtitle: "Postponed Events",
          color: "light-primary",
          icon: <Key size={24} />
        }
        break
      case "completed_events":
        return {
          title: statValue,
          subtitle: "Completed Events",
          color: "light-success",
          icon: <BookOpen size={24} />
        }
      case "most_upcoming_event":
        //setUpComingEvent(statValue)
        break
      case "events_tot_ticket_sales_LKR":
        //setTotSalesFigureLKR(statValue)
        break
      case "events_tot_ticket_sales_USD":
        //setTotSalesFigureUSD(statValue)
        break
      case "events_ticket_sales":
        /*{
          statValue.map((event) => {
            setOnGoingEventsSales((onGoingEventsSales) => [
              ...onGoingEventsSales,
              {
                event_id: event.event_id,
                tot_sale: parseFloat(event.tot_sale),
                event_name: event.event_name
              }
            ])
          })
        }*/
        break
      case "sales_by_date":
        {
          const entries = Object.entries(statValue)
          entries.map(([key, val] = entry) => {
            const lineObj = {
              name: `${key.split("-")[1]}/${key.split("-")[2]}`,
              pv: parseInt(val)
            }
            setSalesByDate((salesByDate) => [...salesByDate, lineObj])
          })
        }
        break
      default:
        break
    }
  }

  useEffect(() => {
    setPending(true)
    StatsService.getBasicStats()
      .then((res) => {
        setStatData([])
        const entries = Object.entries(res.data.data)
        entries.map(([key, val] = entry) => {
          const stat = createStat(key, val)
          if (stat) {
            setStatData((statData) => [...statData, stat])
          }
        })
        setPending(false)
      })
      .catch((err) => {
        console.log(err)
        setPending(false)
      })
  }, [])

  return (
    <div id="dashboard-ecommerce">
      {pending ? (
        <SpinnerComponent />
      ) : (
        <>
          <Row className="match-height">
            <Col xl="12" md="12" xs="12">
              {statData ? (
                <StatsCard
                  cols={{ xl: "2", sm: "6" }}
                  data={statData}
                  className="bg-dark"
                />
              ) : (
                <Skeleton count={4} />
              )}
            </Col>
          </Row>
          <Row className="match-height">
            <Col xl="12" md="12" xs="12">
              <TSaleByDateLineChart
                warning={colors.danger.main}
                data={salesByDate}
              />
            </Col>
          </Row>
          <Row className="match-height">
            <Col xl="12" md="12" xs="12">
              {/*<PieChartComponent
                totSalesFigureLKR={totSalesFigureLKR}
                totSalesFigureUSD={totSalesFigureUSD}
                onGoingEvents={onGoingEvents}
                onGoingEventsSales={onGoingEventsSales}
              />*/}
              <Summary />
            </Col>
          </Row>
          <Row className="match-height"></Row>
        </>
      )}
    </div>
  )
}

export default Home
