// ** JWT Service Import
import JwtService from './jwtService'

// ** Export Service as useJwt
function useJwt(jwtOverrideConfig) {
  const jwt = new JwtService(jwtOverrideConfig)

  return {
    jwt
  }
}

const { jwt } = useJwt({})

export default jwt