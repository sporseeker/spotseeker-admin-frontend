
// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Reactstrap
import { Row, Col, Label, Input, Button } from 'reactstrap'

// ** Icons
import { ArrowLeft, ArrowRight } from 'react-feather'

const PromotionDetails = ({ stepper, productData = {} }) => {
    // Initialize local toggle state from productData if available
    const [promos, setPromos] = useState({
        presales: false,
        phrase1: false,
        phrase2: false,
        vip: false
    })

    useEffect(() => {
        // Support different shapes: productData.promotionsObj or productData.promotions
        if (productData.promotionsObj && typeof productData.promotionsObj === 'object') {
            setPromos(p => ({ ...p, ...productData.promotionsObj }))
        } else if (productData.promotions && typeof productData.promotions === 'object') {
            setPromos(p => ({ ...p, ...productData.promotions }))
        }
    }, [productData])

    const onNext = () => {
        if (stepper && typeof stepper.next === 'function') stepper.next()
    }

    return (
        <Fragment>
            <div className="content-header">
                <h5 className="mb-0" style={{ fontFamily: 'Roboto Condensed', fontSize: '20px', fontWeight: 500, color: '#6A6775' }}>Promotions</h5>
            </div>

            <Row className="mt-2">
                {/* Helper rows for toggles to keep consistent layout */}
                {[
                    { key: 'presales', label: 'Presales' },
                    { key: 'phrase1', label: 'Phrase 1' },
                    { key: 'phrase2', label: 'Phrase 2' },
                    { key: 'vip', label: 'VIP' }
                ].map(({ key, label }) => (
                    <Col xs="12" key={key} className="mb-1">
                        <div className="d-flex align-items-center justify-content-between">
                            <Label className="mb-0" for={`promotions-${key}`} style={{ fontFamily: 'Roboto Condensed', fontSize: '18px', fontWeight: 500, color: '#6A6775' }}>{label}</Label>
                            <div className="form-check form-switch">
                                <Input
                                    type="checkbox"
                                    id={`promotions-${key}`}
                                    className="form-check-input"
                                    checked={!!promos[key]}
                                    readOnly
                                    style={{ cursor: 'not-allowed', pointerEvents: 'none' }}
                                    aria-label={label}
                                />
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>

            <div className="d-flex justify-content-between">
                <Button
                    color="primary"
                    className="btn-prev"
                    onClick={() => stepper && stepper.previous && stepper.previous()}
                >
                    <ArrowLeft
                        size={14}
                        className="align-middle me-sm-25 me-0"
                    ></ArrowLeft>
                    <span className="align-middle d-sm-inline-block d-none">
                        Previous
                    </span>
                </Button>
                <Button
                    type="button"
                    color="primary"
                    className="btn-next"
                    onClick={onNext}
                >
                    <span className="align-middle d-sm-inline-block d-none">Next</span>
                    <ArrowRight
                        size={14}
                        className="align-middle ms-sm-25 ms-0"
                    ></ArrowRight>
                </Button>
            </div>
        </Fragment>
    )
}

export default PromotionDetails
