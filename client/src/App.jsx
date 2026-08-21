import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { useEffect } from 'react'
import axios from 'axios'
import {useDispatch} from 'react-redux'
import { setUserData } from './redux/userScile'

export const ServerUrl = "http://localhost:8000"

function App() {
  const dispatch = useDispatch();

  useEffect( () => {
    const getUser = async () => {
      try {
        const result = await axios.get(ServerUrl + "/api/user/current-user" , {withCredentials : true})
        dispatch(setUserData(result.data))
        console.log(result.data)
      } catch (error) {
        console.log(error)
        dispatch(setUserData(null))
      }
    }
    getUser()
  }, [dispatch])
  
  return (
    <Routes>
      <Route path="/"  element={<Home/>}></Route>
      <Route path="/auth"  element={<Auth/>}></Route>
    </Routes>
  )
}

export default App
