// ** Reducers Imports
import layout from "./layout"
import navbar from "./navbar"
import auth from './authentication'
import qrscanner from "./qrscanner"
import productmgt from './productmgt'
const rootReducer = { auth, navbar, layout, qrscanner, productmgt }

export default rootReducer
