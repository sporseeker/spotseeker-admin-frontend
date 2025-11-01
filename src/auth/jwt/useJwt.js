import JwtService from './jwtService'

function useJwt(jwtOverrideConfig) {
  const jwt = new JwtService(jwtOverrideConfig)
  return { jwt }
}

const { jwt } = useJwt({})
export default jwt
