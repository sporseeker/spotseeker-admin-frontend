// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Badge } from 'reactstrap'

// ** Third Party Components
import { ArrowDown } from 'react-feather'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatNumber } from '../../utility/Utils'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0 && payload[0] && payload[0].value !== undefined) {
    return (
      <div className='recharts-custom-tooltip'>
        <span>{`LKR ${formatNumber(payload[0].value)}.00`}</span>
      </div>
    )
  }

  return null
}

const TSaleByDateLineChart = ({ warning, data }) => {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle tag='h4'>Daily Sales Chart</CardTitle>
        </div>
        
      </CardHeader>

      <CardBody>
        <div className='recharts-wrapper'>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid />
              <XAxis dataKey='name' />
              <YAxis type="number" domain={[0, 'auto']}/>
              <Tooltip content={CustomTooltip} />
              {Object.keys(data).filter(key => key !== 'date').map(() => (
              <Line dataKey='pv' stroke={warning} strokeWidth={3} />
               ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  )
}
export default TSaleByDateLineChart
