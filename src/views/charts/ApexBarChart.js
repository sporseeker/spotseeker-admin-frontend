// ** Third Party Components
import Chart from "react-apexcharts"

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle } from "reactstrap"

const ApexBarChart = ({
  info,
  direction,
  totSalesFigureLKR,
  onGoingEvents,
  onGoingEventsSales
}) => {
  // ** Chart Options
  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: {
        show: true
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "25%",
        borderRadius: [0]
      }
    },
    grid: {
      xaxis: {
        lines: {
          show: false
        }
      }
    },
    colors: info,
    dataLabels: {
      enabled: true,
      textAnchor: "start",
      style: {
        fontSize: 12,
        fontFamily: "Poppins",
        fontWeight: 800,
        colors: ["#373d3f"]
      },
      dropShadow: {
        enabled: true
      }
    },
    xaxis: {
      categories: onGoingEvents
    },
    yaxis: {
      opposite: direction === "rtl"
    }
  }

  // ** Chart Series
  const series = [
    {
      data: onGoingEventsSales
    }
  ]

  return (
    <Card>
      <CardHeader className="d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start">
        <div>
          <CardSubtitle className="text-muted mb-25">Total Sales</CardSubtitle>
          <CardTitle className="fw-bolder" tag="h4">
            {totSalesFigureLKR} LKR
          </CardTitle>
          {/*<CardTitle className="fw-bolder" tag="h4">
            {totSalesFigureUSD} USD
          </CardTitle>*/}
        </div>
      </CardHeader>
      <CardBody>
        <Chart options={options} series={series} type="bar" height={400} />
      </CardBody>
    </Card>
  )
}

export default ApexBarChart
