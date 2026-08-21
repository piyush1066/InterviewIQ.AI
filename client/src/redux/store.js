import { configureStore } from '@reduxjs/toolkit'
import userSlice from "./userScile.js"

export default configureStore({
  reducer: {
    user: userSlice


  },
})