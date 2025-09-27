// ** React Imports
import { useState, useEffect } from 'react'

// ** Third Party Components
import { User, Mail, X, Phone, Eye } from 'react-feather'

// ** Reactstrap Imports
import { Modal, Input, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText, ModalFooter } from 'reactstrap'

// ** Styles
import Select from 'react-select'
import { userRoles } from '../../../../utility/Utils'
import UserService from '../../../../services/UserService'
import { Alert } from '../../../../utility/alerts'

const UserEditModal = ({ open, handleModal, user }) => {
  // ** State
  const [first_name, setFName] = useState(user.first_name)
  const [last_name, setLName] = useState(user.last_name)
  const [phone, setPhone] = useState(user.phone_no)
  const [email, setMail] = useState(user.email)
  const [nic, setNIC] = useState(user.nic)
  const [role, setRole] = useState()
  const [password, setPassword] = useState()
  const [passwordConf, setPasswordConf] = useState()

  // ** Custom close bt
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />

  useEffect(() => {
    setPhone(user.phone_no)
    setMail(user.email)
    setNIC(user.nic)
    setFName(user.first_name)
    setLName(user.last_name)
  }, [user])

  const handleSubmit = () => {
    const updateUser = {
      first_name,
      last_name,
      email, 
      phone,
      nic,
      role,
      password,
      password_confirmation: passwordConf
    }
    UserService.updateUser(updateUser, user.id)
    .then(() => {
      Alert("User updated sucessfully", "success")
    })
    .catch(err => {
      Alert(err.response.data.errors, "error")
    })
  }
  
  return (
    <Modal
      isOpen={open}
      toggle={handleModal}
      className='sidebar-sm'
      modalClassName='modal-slide-in'
      contentClassName='pt-0'
    >
      <ModalHeader className='mb-1' toggle={handleModal} close={CloseBtn} tag='div'>
        <h5 className='modal-title'>Edit User #{user.id}</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
        <div className='mb-1'>
          <Label className='form-label' for='cust-fname'>
            First Name
          </Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input id='cust-fname' onChange={e => setFName(e.target.value)} value={first_name}/>
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='cust-lname'>
            Last Name
          </Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input id='cust-lname' onChange={e => setLName(e.target.value)} value={last_name}/>
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='cust-mail'>
            Email
          </Label>
          <InputGroup>
            <InputGroupText>
              <Mail size={15} />
            </InputGroupText>
            <Input id='cust-mail' onChange={e => setMail(e.target.value)} value={email}/>
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='cust-phone'>
            Phone
          </Label>
          <InputGroup>
            <InputGroupText>
              <Phone size={15} />
            </InputGroupText>
            <Input id='cust-phone' onChange={e => setPhone(e.target.value)} value={phone}/>
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='cust-nic'>
            NIC
          </Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input id='cust-nic' onChange={e => setNIC(e.target.value)} value={nic}/>
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='cust-pass'>
            Password
          </Label>
          <InputGroup>
            <InputGroupText>
              <Eye size={15} />
            </InputGroupText>
            <Input id='cust-pass' onChange={e => setPassword(e.target.value)} value={password}/>
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='cust-pass-conf'>
            Confirm Password
          </Label>
          <InputGroup>
            <InputGroupText>
              <Eye size={15} />
            </InputGroupText>
            <Input id='cust-pass-conf' onChange={e => setPasswordConf(e.target.value)} value={passwordConf}/>
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='status'>
            Role
          </Label>
          <Select
                className='react-select'
                classNamePrefix='select'
                options={userRoles}
                isClearable={false}
                onChange={e => setRole(e.value)}
              />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button className='me-1' color='primary' onClick={handleSubmit}>
          Submit
        </Button>
        <Button color='secondary' onClick={handleModal} outline>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default UserEditModal
