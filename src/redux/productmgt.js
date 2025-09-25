// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

export const productSlice = createSlice({
  name: 'productmgt',
  initialState: {
    productData: {
        name: '',
        description: '',
        organizer: '',
        manager: '',
        start_date: '',
        end_date: '',
        type: '',
        featured: false,
        venue: '',
        invoice: [
          {
            packageName: "Pasindu",
            packageDesc: "",
            packagePrice: "",
            packageQty: "",
            packageAvailQty: "",
            packageResQty: 10
          }
        ],
        banner_img: '',
        thumbnail_img : ''
      }
  },
  reducers: {
    handleProductDataChange: (state, action) => {
        state.productData[action.name] = action.value
    },
    handlePackageDataChange: (state, action) => {
        state.productData.invoice[action.name] = action.value
    }
  }
})

export const { handleProductDataChange, handlePackageDataChange } = productSlice.actions

export default productSlice.reducer