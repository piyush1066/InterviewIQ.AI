import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { useEffect } from 'react'
import axios from 'axios'
import {useDispatch} from 'react-redux'
import { setUserData } from './redux/userScile'
import InterviewPage from "./pages/InterviewPage";
import InterviewHistory from "./pages/InterviewHistory";
import Pricing from './pages/Pricing'
import InterviewReport from './pages/InterviewReport'

export const ServerUrl = "https://interviewiq-ai-fgh9.onrender.com"

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
      <Route path="/interview"  element={<InterviewPage/>}></Route>
      <Route path="/history"  element={<InterviewHistory/>}></Route>
      <Route path="/pricing"  element={<Pricing/>}></Route>
      <Route path="/report/:id"  element={<InterviewReport/>}></Route>
      
      
    </Routes>
  )
}

export default App
