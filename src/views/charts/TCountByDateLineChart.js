import React from 'react'
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatNumber } from '../../utility/Utils'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className='recharts-custom-tooltip'>
        {payload.map((entry, index) => (
          <div key={`item-${index}`}>{`Package ${entry.name}: LKR ${formatNumber(entry.value)}.00`}</div>
        ))}
      </div>
    )
  }
  return null
}

const transformData = (data) => {
  return Object.keys(data).map(date => {
    const packages = data[date]
    const transformedPackages = { date }
    Object.keys(packages).forEach(packageId => {
      transformedPackages[packageId] = parseInt(packages[packageId], 10)
    })
    return transformedPackages
  })
}

const TCountByDateLineChart = ({ warning, data = [] }) => {
  const transformedData = transformData(data)
  const packageIds = transformedData ?? Object.keys(transformedData[0]).filter(key => key !== 'date')
console.log(transformedData)
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle tag='h4'>Daily Sales</CardTitle>
        </div>
      </CardHeader>
      <CardBody>
        <div className='recharts-wrapper'>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={transformedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey='date' />
              <YAxis type="number" domain={[0, 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {packageIds.map(packageId => (
                <Line key={packageId} type="monotone" dataKey={packageId} name={`Package ${packageId}`} stroke={warning} strokeWidth={3} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  )
}

export default TCountByDateLineChart
