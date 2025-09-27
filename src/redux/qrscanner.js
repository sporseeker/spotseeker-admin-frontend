// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import BookingService from "../services/BookingService"

export const verifyBooking = createAsyncThunk('booking/verify', async (qrCode, { rejectWithValue }) => {
  try {
    const response = await BookingService.verifyBooking(qrCode)
    return response.data
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const qrScannerSlice = createSlice({
  name: 'qrscanner',
  initialState: {
    qrcode: "",
    bookingVerified: false,
    status: 'idle',
    color: 'info',
    error: null,
    data: null
  },
  reducers: {
    handleBookingVerify: (state, action) => {
      state.qrcode = action.payload
      BookingService.verifyBooking(action.payload)
        .then((res) => {
          state.bookingVerified = res.data.status
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  extraReducers(builder) {
    builder
      .addCase(verifyBooking.pending, (state) => {
        state.status = 'loading'
        state.color = 'warning'
      })
      .addCase(verifyBooking.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.color = 'success'
        state.bookingVerified = true
        state.data = action.payload
      })
      .addCase(verifyBooking.rejected, (state, action) => {
        state.status = 'failed'
        state.color = 'danger'
        state.error = action.payload
      })
  }
})

export const { handleBookingVerify } = qrScannerSlice.actions

export default qrScannerSlice.reducer

