import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useJwt from "@src/auth/jwt/useJwt"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { useForm, Controller } from "react-hook-form"
import { AlertTriangle, Coffee, X } from "react-feather"
import { handleLogin } from "@store/authentication"
import { AbilityContext } from "@src/utility/context/Can"
import Avatar from "@components/avatar"
import InputPasswordToggle from "@components/input-password-toggle"
import { getHomeRouteForLoggedInUser } from "@utils"
import { Row, Col, Form, Input, Label, Button, CardText, CardTitle } from "reactstrap"
import themeConfig from "@configs/themeConfig"
import "@styles/react/pages/page-authentication.scss"

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
      <span>You have successfully logged in as {role}.</span>
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
  const [pending, setPending] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm({ reValidateMode: "onChange" })
  const source = require(`@src/assets/images/pages/v2-register-dark.png`).default

  const onSubmit = async (formData) => {
    setPending(true)

    try {
      // ✅ Step 0: Get CSRF (Spotseeker uses Sanctum)
      await useJwt.csrf()
      console.log("✅ CSRF cookie set")

      // ✅ Step 1: Call Copilot API first
      console.log("➡️ Calling Copilot backend...")
      const copilotRes = await useJwt.copilotLogin({
        email: formData.loginEmail,
        password: formData.password
      })

      const accessToken = copilotRes?.data?.token || copilotRes?.data?.accessToken
      if (!accessToken) throw new Error("Copilot API did not return accessToken")

      // Save access token in storage
      localStorage.setItem("accessToken", accessToken)

      // ✅ Step 2: Call Spotseeker API for user authentication
      console.log("➡️ Calling Spotseeker API /login...")
      const spotRes = await useJwt.login({
        email: formData.loginEmail,
        password: formData.password
      })

      const userData = spotRes?.data?.data || spotRes?.data
      if (!userData) throw new Error("Spotseeker login failed")

      // ✅ Step 3: Merge data and dispatch
      const combinedPayload = {
        data: {
          ...userData,
          accessToken
        }
      }

      dispatch(handleLogin(combinedPayload))
      ability.update([{ action: "manage", subject: "all" }])
      navigate(getHomeRouteForLoggedInUser(userData.role || "Admin"))

      toast(t => (
        <ToastContent
          t={t}
          name={userData.email || userData.name || "Admin"}
          role={userData.role || "Admin"}
        />
      ))

    } catch (err) {
      console.error("❌ Login error:", err)
      toast(t => (
        <ToastError
          t={t}
          title="Login Failed"
          message={err.response?.data?.message || err.message}
        />
      ))
    } finally {
      setPending(false)
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
              Welcome to <br /> Pinnacle Dashboard
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