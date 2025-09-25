import Avatar from '@components/avatar'
import { AlertCircle } from 'react-feather'

const ToastSuccess = ({ title, message }) => {
    return (
      <div className='d-flex'>
        <div className='me-1'>
          <Avatar size='sm' color='success' icon={<AlertCircle size={12} />} />
        </div>
        <div className='d-flex flex-column'>
          <div className='d-flex justify-content-between'>
            <h6>{title}</h6>
          </div>
          <span>{message}</span>
        </div>
      </div>
    )
}
export default ToastSuccess