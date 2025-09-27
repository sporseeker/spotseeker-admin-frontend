// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Custom Components
import BreadCrumbs from '@components/breadcrumbs'
import ProductCreateWizard from './ProductCreateWizard'

import { useParams } from 'react-router-dom'

const ProductCreate = () => {

  const { type, id } = useParams()

  return (
    <Fragment>
      <Row>
        <Col sm='12'>
          <ProductCreateWizard type={type} id={id}/>
        </Col>
      </Row>
    </Fragment>
  )
}
export default ProductCreate
