import React, { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Brush
} from 'recharts'
// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Badge } from 'reactstrap'
import { formatNumber, transformData } from '../../utility/Utils'

const getLast7DaysData = (data) => {
    // Find the last date in the data
    const dates = data.map(item => new Date(item.date))
    const lastDate = new Date(Math.max(...dates.map(date => date.getTime())))
    
    // Calculate the start date for the last 7 days
    const startDate = new Date(lastDate)
    startDate.setDate(startDate.getDate() - 6)
    
    // Format the start date
    const formattedStartDate = startDate.toISOString().split('T')[0]
    
    // Filter the data to include only the last 7 days
    return data.filter(item => item.date >= formattedStartDate)
  }
  const CustomLabel = ({x, y, stroke, value}) => {

    return (
      <text x={x} y={y} dy={-10} fill={stroke} fontSize={10} textAnchor="middle" fontWeight={900} color='#d1d1d1'>
        {formatNumber(value)}
      </text>
    )
  }
const LineChartComponent = ({ data, chartTitle, strokeColor, showLegend }) => {
  // Check if data is available and has at least one entry
  if (!data || data.length === 0) {
    return <p>No data available</p>
  }

  const { transformedData, allKeys } = transformData(data)
  const last7DaysData = getLast7DaysData(transformedData)
  const [activeSeries, setActiveSeries] = useState([])

  // Define color mapping for different keys
  const colors = [
    "#8884d8",
    "#ff7210",
    "#8C3F09",
    "#277D2F",
    "#5A5B64",
    "#957DFF",
    "#FFA15F",
    "#8C3F09"
  ]

  const handleLegendClick = (dataKey) => {
    if (activeSeries.includes(dataKey)) {
      setActiveSeries(activeSeries.filter(el => el !== dataKey))
    } else {
      setActiveSeries(prev => [...prev, dataKey])
    }
  }

  
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle tag='h4'>{chartTitle}</CardTitle>
        </div>
        
      </CardHeader>

      <CardBody>
        <div className='recharts-wrapper'>
        <ResponsiveContainer>
            <LineChart
                data={transformedData}
            >
                <CartesianGrid />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                {showLegend && <Legend onClick={(e) => handleLegendClick(e.dataKey)} iconType="circle" display={false}/>}
                <Brush dataKey="date" startIndex={transformedData.length - last7DaysData.length} endIndex={transformedData.length - 1} height={30} stroke="#8884d8" />
                {allKeys.map((key, index) => (
                    <Line
                    key={key}
                    dataKey={key}
                    stroke={strokeColor || colors[index]}
                    strokeWidth={3}
                    hide={activeSeries.includes(key)}
                    label={<CustomLabel/>}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
    
  )
}

export default LineChartComponent
