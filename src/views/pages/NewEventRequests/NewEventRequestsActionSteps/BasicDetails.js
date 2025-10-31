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

// Local options for selects
const eventTypeOptions = [
    { value: 'outdoor', label: 'Outdoor' },
    { value: 'indoor', label: 'Indoor' },
    { value: 'virtual', label: 'Virtual' }
]

const eventCategoryOptions = [
    { value: 'concert', label: 'Concert' },
    { value: 'conference', label: 'Conference' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'meetup', label: 'Meetup' }
]

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
            <div className='content-header'>
                <h5 className='mb-0'>Basic Details</h5>
            </div>
            <Form>
                <Row>
                    <Col md={productData.ftype === 'edit' ? '4' : '6'} className='mb-1'>
                        <Label className='form-label' for='productName'>
                            Event Name
                        </Label>

                        <div className='d-flex align-items-center'>
                            <Input
                                type='checkbox'
                                id='enable_event'
                                name='enable_event'
                                className='me-2'
                            />
                            <Input className='flex-grow-1' onChange={handleChange} name="name" value={productData.name} />
                        </div>
                    </Col>
                    <Col md={productData.ftype === 'edit' ? '4' : '6'} className='mb-1'>
                        <Label className='form-label' for='free-seating'>
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
                            <Label className='form-label' for='productStatus'>
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
                        <Label className='form-label' for={`productDesc`}>
                            Event Description
                        </Label>
                        {/*<Input type="textarea" onChange={handleChange} name="description" value={productData.description}/>*/}
                        <EditorControlled handleEditor={handleEditor} name="description" handleEditorChange={handleEditorChange} editorValue={editorValue} />
                    </Col>
                </Row>
                <Row>
                    <Col md='6' className='mb-1'>
                        <Label className='form-label' for='start-date-time'>
                            Start Date & Time
                        </Label>
                        <Flatpickr
                            data-enable-time
                            id='start-date-time'
                            name='start-date-time'
                            className='form-control'
                            value={productData.start_date}
                            onChange={(date, dateStr) => handleStartDateChange(dateStr)}
                            options={{
                                dateFormat: "Y-m-d H:i",
                                minDate: "today"
                            }}
                        />
                    </Col>
                    <Col md='6' className='mb-1'>
                        <Label className='form-label' for='end-date-time'>
                            End Date & Time
                        </Label>
                        <Flatpickr
                            data-enable-time
                            id='end-date-time'
                            name="end-date-time"
                            className='form-control'
                            value={productData.end_date}
                            onChange={(date, dateStr) => handleEndDateChange(dateStr)}
                            options={{
                                dateFormat: "Y-m-d H:i",
                                minDate: "today"
                            }}
                        />
                    </Col>
                   
                </Row>

                <Row>
                    <Col md='6' className='mb-1'>
                        <Label className='form-label' for='event_type'>
                            Event Type
                        </Label>
                        <Select
                            name='event_type'
                            className='react-select'
                            classNamePrefix='select'
                            value={eventTypeOptions.find(({ value }) => value === productData.event_type)}
                            options={eventTypeOptions}
                            onChange={handleDropdownChange}
                        />
                    </Col>
                    <Col md='6' className='mb-1'>
                        <Label className='form-label' for='event_category'>
                            Event Category
                        </Label>
                        <Select
                            name='event_category'
                            className='react-select'
                            classNamePrefix='select'
                            value={eventCategoryOptions.find(({ value }) => value === productData.event_category)}
                            options={eventCategoryOptions}
                            onChange={handleDropdownChange}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col md='6' className='mb-1'>
                        <Label className='form-label' for='organization_name'>
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
                        <Label className='form-label' for='organizer_name'>
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
