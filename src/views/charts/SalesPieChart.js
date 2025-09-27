import React from "react"
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

const generateColors = (numColors) => {
  const colors = []
  for (let i = 0; i < numColors; i++) {
    // Generate darker colors by limiting RGB values (avoid high values for light colors)
    const r = Math.floor(Math.random() * 155) // Limit to 0-155
    const g = Math.floor(Math.random() * 155) // Limit to 0-155
    const b = Math.floor(Math.random() * 155) // Limit to 0-155
    const darkColor = `rgb(${r},${g} ,${b})` // Generate RGB color
    colors.push(darkColor)
  }
  return colors
}

const PieChartComponent = ({ onGoingEventsSales }) => {
  const colors = generateColors(onGoingEventsSales.length)

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle tag="h4">Sales By Event</CardTitle>
        </div>
      </CardHeader>

      <CardBody>
        <div className="recharts-wrapper">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={onGoingEventsSales}
                dataKey="tot_sale"
                nameKey="event_name"
                cx="40%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label>
                {onGoingEventsSales.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ width: 250 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  )
}

export default PieChartComponent
