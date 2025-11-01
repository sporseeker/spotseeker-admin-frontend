// ** React Imports
import { Fragment, useEffect, useState} from 'react'

// ** Utils

// ** Third Party Components
import { ArrowLeft, ArrowRight } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import Select from 'react-select'

// ** Reactstrap Imports
import { Button, Col, Form, Input, Label, Row } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import UserService from '../../../../services/UserService'
import VenueService from '../../../../services/VenueService'
import { eventStatuses, trueFalseOpts } from '../../../../utility/Utils'
import EditorControlled from '../../../ui-elements/inputs/EditorControlled'

// Local options for selects (commented out - now using regular input fields)
// const eventTypeOptions = [
//     { value: 'outdoor', label: 'Outdoor' },
//     { value: 'indoor', label: 'Indoor' },
//     { value: 'virtual', label: 'Virtual' }
// ]

// const eventCategoryOptions = [
//     { value: 'concert', label: 'Concert' },
//     { value: 'conference', label: 'Conference' },
//     { value: 'workshop', label: 'Workshop' },
//     { value: 'meetup', label: 'Meetup' }
// ]

// ** Services

const BasicDetails = ({ stepper, handleChange, handleDropdownChange,  handleStartDateChange, handleEndDateChange, productData, handleEditor, handleEditorChange, editorValue }) => {

const [, setPending] = useState(false)
const onSubmit = () => {
        stepper.next()
    }

    useEffect(() => {
        setPending(true)
        UserService.getAllUserByRole('manager', null, null, null, true)
            .then(res => {
                const managerObjs = res.data.data
                managerObjs.map(manager => {
                    const mgObj = {
                        value: manager.id,
                        label: manager.name
                    }
                    setManagers(managers => [...managers, mgObj])
                })
                setPending(false)
            })
            .catch(err => {
                console.log(err)
                setPending(false)
            })
    }, [])

    useEffect(() => {
        VenueService.getAllVenues()
            .then(res => {
                const venueObjs = res.data.data
                venueObjs.map(venue => {
                    const venueObj = {
                        value: venue.id,
                        label: venue.name
                    }
                    setVenues(venues => [...venues, venueObj])
                })
            })
    }, [])

    return (
        <Fragment>
            <Col md={4}>
                <h4 style={{ fontSize: '20px', marginBottom: '10px', color: '#5A6C7D', fontFamily: 'Roboto Condensed' }}>Basic Details</h4>
            </Col>
            <Form>
                <Row>
                    <Col md={productData.ftype === 'edit' ? '4' : '6'} className='mb-1'>
                        <Label className='form-label' for='productName' style={{ fontSize: '16px' }}>
                            Event Name
                        </Label>

                        <div className='d-flex align-items-center'>
                            <Input
                                type='checkbox'
                                id='enable_event'
                                name='enable_event'
                                checked={!!productData.enable_event}
                                onChange={e => handleChange({ target: { name: 'enable_event', value: e.target.checked } })}
                                className='me-2'
                            />
                            <Input className='flex-grow-1' onChange={handleChange} name="name" value={productData.name} />
                        </div>
                    </Col>
                    <Col md={productData.ftype === 'edit' ? '4' : '6'} className='mb-1'>
                        <Label className='form-label' for='free-seating' style={{ fontSize: '16px' }}>
                          Featured
                        </Label>
                        <Select
                            name='free_seating'
                            className='react-select'
                            classNamePrefix='select'
                            value={trueFalseOpts.find(({ value }) => value === productData.free_seating)}
                            options={trueFalseOpts}
                            onChange={handleDropdownChange}
                        />
                    </Col>
                    {
                        productData.ftype === 'edit' ? <Col md="4" className='mb-1'>
                            <Label className='form-label' for='productStatus' style={{ fontSize: '16px' }}>
                                Event Status
                            </Label>
                            <Select
                                name='status'
                                className='react-select'
                                classNamePrefix='select'
                                value={eventStatuses.find(({ value }) => value === productData.status)}
                                options={eventStatuses}
                                onChange={handleDropdownChange}
                            />
                        </Col> : ""
                    }
                </Row>
                <Row>
                    <Col md='12' className='mb-1'>
                        <Label className='form-label' for={`productDesc`} style={{ fontSize: '16px' }}>
                            Event Description
                        </Label>
                        <div className='d-flex align-items-start'>
                            <Input
                                type='checkbox'
                                id='description_enabled'
                                name='description_enabled'
                                checked={!!productData.description_enabled}
                                onChange={e => handleChange({ target: { name: 'description_enabled', value: e.target.checked } })}
                                className='me-2 mt-1'
                            />
                            <div className='flex-grow-1'>
                                {/*<Input type="textarea" onChange={handleChange} name="description" value={productData.description}/>*/}
                                <EditorControlled handleEditor={handleEditor} name="description" handleEditorChange={handleEditorChange} editorValue={editorValue} />
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md='6' className='mb-1'>
                        <Label className='form-label' for='start-date-time' style={{ fontSize: '16px' }}>
                            Start Date & Time
                        </Label>
                        <div className='d-flex align-items-center'>
                            <Input
                                type='checkbox'
                                id='start_date_enabled'
                                name='start_date_enabled'
                                checked={!!productData.start_date_enabled}
                                onChange={e => handleChange({ target: { name: 'start_date_enabled', value: e.target.checked } })}
                                className='me-2'
                            />
                            <Flatpickr
                                data-enable-time
                                id='start-date-time'
                                name='start-date-time'
                                className='form-control flex-grow-1'
                                value={productData.start_date}
                                onChange={(date, dateStr) => handleStartDateChange(dateStr)}
                                options={{
                                    dateFormat: "Y-m-d H:i",
                                    minDate: "today"
                                }}
                            />
                        </div>
                    </Col>
                    <Col md='6' className='mb-1'>
                        <Label className='form-label' for='end-date-time' style={{ fontSize: '16px' }}>
                            End Date & Time
                        </Label>
                        <div className='d-flex align-items-center'>
                            <Input
                                type='checkbox'
                                id='end_date_enabled'
                                name='end_date_enabled'
                                checked={!!productData.end_date_enabled}
                                onChange={e => handleChange({ target: { name: 'end_date_enabled', value: e.target.checked } })}
                                className='me-2'
                            />
                            <Flatpickr
                                data-enable-time
                                id='end-date-time'
                                name="end-date-time"
                                className='form-control flex-grow-1'
                                value={productData.end_date}
                                onChange={(date, dateStr) => handleEndDateChange(dateStr)}
                                options={{
                                    dateFormat: "Y-m-d H:i",
                                    minDate: "today"
                                }}
                            />
                        </div>
                    </Col>
                   
                </Row>

                <Row>
                    <Col md='6' className='mb-1'>
                        <Label className='form-label' for='event_type' style={{ fontSize: '16px' }}>
                            Event Type
                        </Label>
                        <Input 
                            type='text' 
                            id='event_type'
                            name='event_type' 
                            onChange={handleChange} 
                            value={productData.event_type || ''} 
                        />
                        {/* <Select
                            name='event_type'
                            className='react-select'
                            classNamePrefix='select'
                            value={eventTypeOptions.find(({ value }) => value === productData.event_type)}
                            options={eventTypeOptions}
                            onChange={handleDropdownChange}
                        /> */}
                    </Col>
                    <Col md='6' className='mb-1'>
                        <Label className='form-label' for='event_category' style={{ fontSize: '16px' }}>
                            Event Category
                        </Label>
                        <Input 
                            type='text' 
                            id='event_category'
                            name='event_category' 
                            onChange={handleChange} 
                            value={productData.event_category || ''} 
                        />
                        {/* <Select
                            name='event_category'
                            className='react-select'
                            classNamePrefix='select'
                            value={eventCategoryOptions.find(({ value }) => value === productData.event_category)}
                            options={eventCategoryOptions}
                            onChange={handleDropdownChange}
                        /> */}
                    </Col>
                </Row>

                <Row>
                    <Col md='6' className='mb-1'>
                        <Label className='form-label' for='organization_name' style={{ fontSize: '16px' }}>
                            Organization Name
                        </Label>
                        <div className='d-flex align-items-center'>
                            <Input
                                type='checkbox'
                                id='organization_enabled'
                                name='organization_enabled'
                                checked={!!productData.organization_enabled}
                                onChange={e => handleChange({ target: { name: 'organization_enabled', value: e.target.checked } })}
                                className='me-2'
                            />
                            <Input type='text' onChange={handleChange} name='organization_name' value={productData.organization_name || ''} />
                        </div>
                    </Col>
                    <Col md='6' className='mb-1'>
                        <Label className='form-label' for='organizer_name' style={{ fontSize: '16px' }}>
                            Organizer Name
                        </Label>
                        <div className='d-flex align-items-center'>
                            <Input
                                type='checkbox'
                                id='organizer_enabled'
                                name='organizer_enabled'
                                checked={!!productData.organizer_enabled}
                                onChange={e => handleChange({ target: { name: 'organizer_enabled', value: e.target.checked } })}
                                className='me-2'
                            />
                            <Input type='text' onChange={handleChange} name='organizer_name' value={productData.organizer_name || ''} />
                        </div>
                    </Col>
                </Row>
               
                <div className='d-flex justify-content-between'>
                    <Button color='secondary' className='btn-prev' outline disabled>
                        <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
                        <span className='align-middle d-sm-inline-block d-none'>Previous</span>
                    </Button>
                    <Button type='button' color='primary' className='btn-next' onClick={onSubmit}>
                        <span className='align-middle d-sm-inline-block d-none'>Next</span>
                        <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
                    </Button>
                </div>
            </Form>
        </Fragment>
    )
}

export default BasicDetails
