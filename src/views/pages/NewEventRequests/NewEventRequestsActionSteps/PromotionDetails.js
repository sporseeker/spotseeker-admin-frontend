
// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Reactstrap
import { Row, Col, Label, Input, Button } from 'reactstrap'

const PromotionDetails = ({ stepper, productData = {}, onChange }) => {
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

    const handleToggle = (key, checked) => {
        const next = { ...promos, [key]: checked }
        setPromos(next)

        // If parent provided an onChange handler, notify it in a simple synthetic event shape
        if (typeof onChange === 'function') {
            onChange({ target: { name: `promotions.${key}`, value: checked } })
        }
    }

    const onNext = () => {
        if (stepper && typeof stepper.next === 'function') stepper.next()
    }

    return (
        <Fragment>
            <div className="content-header">
                <h5 className="mb-0">Promotions</h5>
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
                            <Label className="mb-0" for={`promotions-${key}`}>{label}</Label>
                            <div className="form-check form-switch">
                                <Input
                                    type="checkbox"
                                    id={`promotions-${key}`}
                                    className="form-check-input"
                                    checked={!!promos[key]}
                                    onChange={e => handleToggle(key, e.target.checked)}
                                    aria-label={label}
                                />
                            </div>
                        </div>
                    </Col>
                ))}

                <Col xs="12" className="mt-2 d-flex justify-content-end">
                    <Button color="secondary" className="me-1" onClick={() => stepper && stepper.previous && stepper.previous()}>Previous</Button>
                    <Button color="primary" onClick={onNext}>Next</Button>
                </Col>
            </Row>
        </Fragment>
    )
}

export default PromotionDetails
