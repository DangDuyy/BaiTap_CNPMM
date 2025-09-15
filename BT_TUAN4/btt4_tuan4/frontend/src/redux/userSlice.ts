/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/lib/api'

interface UserState {
  user: any | null
}

const initialState: UserState = { user: null }

export const login = createAsyncThunk('user/login', async (payload: { email: string; password: string }, thunkAPI) => {
  try {
    const res = await api.post('/users/login', payload)
    return res.data
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.response?.data || { message: err.message })
  }
})

export const logout = createAsyncThunk('user/logout', async (_, thunkAPI) => {
  try {
    const res = await api.delete('/users/logout')
    return res.data
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.response?.data || { message: err.message })
  }
})

export const sendOtp = createAsyncThunk('user/sendOtp', async (payload: { email: string }, thunkAPI) => {
  try {
    const res = await api.post('/users/send-otp', payload)
    return res.data
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.response?.data || { message: err.message })
  }
})

export const forgotPassword = createAsyncThunk('user/forgotPassword', async (payload: { email: string }, thunkAPI) => {
  try {
    const res = await api.post('/users/forgot-password', payload)
    return res.data
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.response?.data || { message: err.message })
  }
})

export const resetPassword = createAsyncThunk('user/resetPassword', async (payload: { email: string; token: string; newPassword: string }, thunkAPI) => {
  try {
    const res = await api.post('/users/reset-password', payload)
    return res.data
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err?.response?.data || { message: err.message })
  }
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload
    },
    clearUser(state) {
      state.user = null
    }
  }
  ,
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
      state.user = action.payload
    })
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null
    })
  }
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
