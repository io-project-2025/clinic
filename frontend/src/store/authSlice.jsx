import { createSlice } from '@reduxjs/toolkit'

const initialState = 'guest'

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            return action.payload.role
        },
        logout: () => {
            return initialState
        }
    }
})

export const {login, logout} = authSlice.actions
export default authSlice.reducer