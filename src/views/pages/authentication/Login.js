// ** React Imports
import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useJwt from "@src/auth/jwt/useJwt"

// ** Third Party Components
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { useForm, Controller } from "react-hook-form"
import { AlertTriangle, Coffee, X } from "react-feather"

// ** Actions
import { handleLogin } from "@store/authentication"

// ** Context
import { AbilityContext } from "@src/utility/context/Can"

// ** Custom Components
import Avatar from "@components/avatar"
import InputPasswordToggle from "@components/input-password-toggle"

// ** Utils
import { getHomeRouteForLoggedInUser } from "@utils"

// ** Reactstrap Imports
import { Row, Col, Form, Input, Label, Button, CardText, CardTitle } from "reactstrap"

// ** Config
import themeConfig from "@configs/themeConfig"

// ** Styles
import "@styles/react/pages/page-authentication.scss"

// Toasts
const ToastContent = ({ t, name, role }) => (
  <div className="d-flex">
    <div className="me-1">
      <Avatar size="sm" color="success" icon={<Coffee size={12} />} />
    </div>
    <div className="d-flex flex-column">
      <div className="d-flex justify-content-between">
        <h6>{name}</h6>
        <X size={12} className="cursor-pointer" onClick={() => toast.dismiss(t.id)} />
      </div>
      <span>You have successfully logged in as an {role} user to Admin dashboard.</span>
    </div>
  </div>
)

const ToastError = ({ t, title, message }) => (
  <div className="d-flex">
    <div className="me-1">
      <Avatar size="sm" color="danger" icon={<AlertTriangle size={12} />} />
    </div>
    <div className="d-flex flex-column">
      <div className="d-flex justify-content-between">
        <h6>{title}</h6>
        <X size={12} className="cursor-pointer" onClick={() => toast.dismiss(t.id)} />
      </div>
      <span>{message}</span>
    </div>
  </div>
)

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const ability = useContext(AbilityContext)
  const { control, setError, handleSubmit, formState: { errors } } = useForm({ reValidateMode: "onChange" })

  const source = require(`@src/assets/images/pages/v2-register-dark.png`).default
  const [pending, setPending] = useState(false)

  const onSubmit = (data) => {
    setPending(true)

    if (Object.values(data).every((field) => field.length > 0)) {
      useJwt.login({ email: data.loginEmail, password: data.password })
        .then((res) => {
          const resData = { ...res.data } // resData = { user, accessToken, refreshToken }

          if (resData.user.userType.toLowerCase() === "admin") {
            // Save to Redux and LocalStorage
            dispatch(handleLogin(resData))

            // Update abilities
            ability.update([{ action: "manage", subject: "all" }])

            // Navigate to dashboard
            navigate(getHomeRouteForLoggedInUser(resData.user.userType))

            // Success toast
            toast((t) => (
              <ToastContent
                t={t}
                role={resData.user.userType}
                name={resData.user.email}
              />
            ))
          } else {
            toast((t) => (
              <ToastError
                t={t}
                title="OOOPS! Something Went Wrong"
                message="These credentials are not in our system"
              />
            ))
          }

          setPending(false)
        })
        .catch((err) => {
          console.error(err)
          setPending(false)
          toast((t) => (
            <ToastError
              t={t}
              title="OOOPS! Something Went Wrong"
              message={err.response?.data?.message || err.message}
            />
          ))
        })
    } else {
      // Field validation
      setPending(false)
      for (const key in data) {
        if (!data[key]) setError(key, { type: "manual" })
      }
    }
  }

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
          <img src={themeConfig.app.appLogoImage} alt="logo" width={200} />
        </Link>

        <Col className="d-flex align-items-center auth-bg px-2 p-lg-5" lg="4" sm="12">
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              Welcome to <br />
              Pinnacle Dashboard
            </CardTitle>
            <CardText className="mb-2">Where it all begins!</CardText>
            <Form className="auth-login-form mt-2" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-1">
                <Label className="form-label" for="login-email">Email / Username</Label>
                <Controller
                  id="loginEmail"
                  name="loginEmail"
                  control={control}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type="text"
                      placeholder="Enter email address"
                      invalid={errors.loginEmail && true}
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="mb-1">
                <Controller
                  id="password"
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle
                      className="input-group-merge"
                      invalid={errors.password && true}
                      {...field}
                    />
                  )}
                />
              </div>

              <Button type="submit" color="primary" block disabled={pending}>
                {pending ? "Logging you in..." : "Sign in"}
              </Button>
            </Form>
          </Col>
        </Col>

        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login Cover" width="500px" />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Login