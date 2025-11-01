// ** React Imports
import { Fragment, useState, useEffect } from "react"

//import { useSelector } from 'react-redux'

// ** Third Party Components
import { X, Plus, ArrowLeft, ArrowRight } from "react-feather"
// ** Custom Components
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
// ** Reactstrap Imports
import { Label, Row, Col, Button, Form, Input, CardBody, Alert } from "reactstrap"

const PackageDetails = ({ stepper, productData, handleChange, handlePackageAdd, handlePackageRemove, handleDropdownChange }) => {

    //const productData = useSelector((state) => state.productmgt.productData)
    const [count, setCount] = useState(1)
    const [packs, setPacks] = useState([])

    const onSubmit = () => {
        stepper.next()
    }

    const increaseCount = (i) => {
        if (i !== null) {
            handlePackageAdd(i)
        } else {
            setCount(count + 1)
            handlePackageAdd()
        }
    }

    const deleteForm = (i) => {
        console.log(i)
        setCount(count - 1)
        handlePackageRemove(i)
    }

    useEffect(() => {
        setCount(productData.invoice.length)
        setPacks(productData.invoice)
    }, [productData.invoice])

    
    const statusOpts = [
        { value: 'pending', label: 'Pending' },
        { value: 'active', label: 'Active' },
        { value: 'closed', label: 'Closed' }
    ]

    // Check if all packages are empty
    const hasPackageData = packs.some(pack => pack.packageName || pack.packagePrice || pack.packageQty || pack.packageStatus || pack.releasingDate || pack.closingDate)

    return (
        <Fragment>
            <Form>
                <Col md={4}>
                    <h4 style={{ fontSize: '20px', marginBottom: '20px' }}>Packages</h4>
                </Col>
                <Row>
                    <Col md="12" className="mb-1">
                        <CardBody>

                            {!hasPackageData ? (
                                <div className="text-center py-3">
                                    <h5 className="mb-0" style={{ fontSize: '18px' }}>No Package Data Available</h5>
                                </div>
                            ) : (
                                packs.map((pack, i) => {
                                    return (

                                        <Row className="mb-1" key={i}>
                                            <Col md={12}>
                                                <Row>
                                                    <Col md={4} className="mb-md-0 mb-1">
                                                        <Label
                                                            className="form-label"
                                                            for={`packageName-${i}`}
                                                        >
                                                            Package Name
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            id={`packageName-${i}`}
                                                            onChange={e => handleChange(e, i)}
                                                            value={pack.packageName}
                                                            name="packageName"
                                                        />
                                                    </Col>
                                                    <Col md={2}>
                                                        <Label className="form-label" for={`packageStatus-${i}`}>
                                                            Packages Status
                                                        </Label>
                                                        <Select
                                                            name={`packageStatus-${i}`}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            value={statusOpts.find(({ value }) => value === pack["packageStatus"])}
                                                            options={statusOpts}
                                                            onChange={handleDropdownChange}
                                                        />
                                                    </Col>
                                                    <Col md={3} className="mb-md-0 mb-1">
                                                        <Label className="form-label" for={`releasing-${i}`}>
                                                            Releasing Date & Time
                                                        </Label>
                                                        <Flatpickr
                                                            id={`releasing-${i}`}
                                                            className='form-control'
                                                            value={pack["releasingDate"] || ''}
                                                            onChange={(date, dateStr) => handleChange({ target: { name: 'releasingDate', value: dateStr } }, i)}
                                                            options={{ dateFormat: "Y-m-d H:i", enableTime: true }}
                                                        />
                                                    </Col>
                                                    <Col md={3} className="mb-md-0 mb-1">
                                                        <Label className="form-label" for={`closing-${i}`}>
                                                            Closing Date & Time
                                                        </Label>
                                                        <Flatpickr
                                                            id={`closing-${i}`}
                                                            className='form-control'
                                                            value={pack["closingDate"] || ''}
                                                            onChange={(date, dateStr) => handleChange({ target: { name: 'closingDate', value: dateStr } }, i)}
                                                            options={{ dateFormat: "Y-m-d H:i", enableTime: true }}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={2} className="mb-md-0 mb-1">
                                                        <Label
                                                            className="form-label"
                                                            for={`packagePrice-${i}`}
                                                        >
                                                            Price
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            id={`packagePrice-${i}`}
                                                            onChange={e => handleChange(e, i)}
                                                            value={pack["packagePrice"]}
                                                            name="packagePrice"
                                                        />
                                                    </Col>
                                                    <Col md={2} className="mb-md-0 mb-1">
                                                        <Label
                                                            className="form-label"
                                                            for={`packageQty-${i}`}
                                                        >
                                                            Total Release Count
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            id={`packageQty-${i}`}
                                                            onChange={e => handleChange(e, i)}
                                                            value={pack["packageQty"]}
                                                            name="packageQty"
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md={12} className="text-end mt-1">
                                                <Button
                                                    color={pack.deleted ? "success" : "danger"}
                                                    className="text-nowrap px-1"
                                                    onClick={() => { pack.deleted ? increaseCount(i) : deleteForm(i) }}
                                                    outline>
                                                    {pack.deleted ? <Plus size={14} className="me-50" /> : <X size={14} className="me-50" />}
                                                    <span>{pack.deleted ? "Add again" : "Delete"}</span>
                                                </Button>
                                            </Col>
                                            <Col sm={12}>
                                                <hr />
                                            </Col>
                                        </Row>
                                    )
                                })
                            )}
                            
                        </CardBody>
                    </Col>
                </Row>
                <div className="d-flex justify-content-between">
                    <Button
                        type="button"
                        color="primary"
                        className="btn-prev"
                        onClick={() => stepper.previous()}
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
                        onClick={onSubmit}
                    >
                        <span className="align-middle d-sm-inline-block d-none">Next</span>
                        <ArrowRight
                            size={14}
                            className="align-middle ms-sm-25 ms-0"
                        ></ArrowRight>
                    </Button>
                </div>
            </Form>
        </Fragment>
    )
}

export default PackageDetails
