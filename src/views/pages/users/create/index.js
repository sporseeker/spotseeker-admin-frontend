// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Input,
  Form,
  Button,
  Label
} from "reactstrap"

import Select from "react-select"
import { useState } from "react"
import UserService from "../../../../services/UserService"
import { Alert } from "../../../../utility/alerts"
import InputPasswordToggle from "@components/input-password-toggle"

const CreateUser = () => {
  const [fName, setFName] = useState("")
  const [lName, setLName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confPassword, setConfPassword] = useState("")
  const [role, setRole] = useState("")

  const roleOpts = [
    {
      value: "user",
      label: "User"
    },
    {
      value: "manager",
      label: "Manager"
    },
    {
      value: "coordinator",
      label: "Coordinator"
    },
    {
      value: "admin",
      label: "Admin"
    }
  ]

  const handleDropdownChange = (option) => {
    setRole(option.value)
  }

  const handleSubmit = () => {
    const userObj = {
      name: `${fName} ${lName}`,
      email,
      role,
      password,
      password_confirmation: confPassword
    }

    UserService.createUser(userObj)
      .then(() => {
        Alert("User created successfully", "success")
        setFName("")
        setLName("")
        setEmail("")
        setPassword("")
        setConfPassword("")
        setRole("")
      })
      .catch((err) => {
        Alert(err.response.data.errors, "error")
      })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Create User</CardTitle>
      </CardHeader>

      <CardBody>
        <Form>
          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="nameMulti">
                First Name
              </Label>
              <Input
                type="text"
                name="name"
                id="nameMulti"
                placeholder="First Name"
                value={fName}
                onChange={(e) => setFName(e.target.value)}
              />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="lastNameMulti">
                Last Name
              </Label>
              <Input
                type="text"
                name="lastname"
                id="lastNameMulti"
                placeholder="Last Name"
                value={lName}
                onChange={(e) => setLName(e.target.value)}
              />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="cityMulti">
                Email
              </Label>
              <Input
                type="email"
                name="email"
                id="cityMulti"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="EmailMulti">
                Role
              </Label>
              <Select
                name="role"
                className="react-select"
                classNamePrefix="select"
                options={roleOpts}
                onChange={handleDropdownChange}
              />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="CountryMulti">
                Password
              </Label>
              <InputPasswordToggle
                name="password"
                id="CountryMulti"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label" for="CountryMulti">
                Confirm Password
              </Label>
              <InputPasswordToggle
                name="conf-password"
                id="CountryMulti"
                placeholder="Password"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
              />
            </Col>
            <Col sm="12">
              <div className="d-flex">
                <Button
                  className="me-1"
                  color="primary"
                  type="button"
                  onClick={handleSubmit}>
                  Submit
                </Button>
                <Button outline color="secondary" type="reset">
                  Reset
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  )
}
export default CreateUser
