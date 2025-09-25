// ** Reactstrap Imports
import { Button, Form, Input, Row, Col } from 'reactstrap'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Styles
import '@styles/base/pages/page-misc.scss'
import themeConfig from '../../../configs/themeConfig'
import { Link } from 'react-router-dom'

const ComingSoon = () => {
  // ** Hooks
  const { skin } = useSkin()

  const illustration = skin === 'dark' ? 'coming-soon-dark.svg' : 'coming-soon.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

  return (
    <div className='misc-wrapper'>
      <Link className="brand-logo" to="/">
        <img src={themeConfig.app.appLogoImage} alt='logo' width={200}/>
      </Link>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          <h2 className='mb-1'>We are launching soon 🚀</h2>
          <p className='mb-3'>Our engineering team is working on this!</p>
          <img className='img-fluid' src={source} alt='Coming soon page' />
        </div>
      </div>
    </div>
  )
}
export default ComingSoon
