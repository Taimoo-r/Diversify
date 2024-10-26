import Home from "./pages/Home"
import React from 'react'
import { BrowserRouter,Routes,Route } from "react-router-dom"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Profile from "./pages/Profile"
import Dashboard from "./pages/Dashboard"
import MessageScreen from "./pages/MessageScreen"
import JobsSection from "./pages/JobsSection"
import CommunitiesSection from "./pages/CommunitiesSection"
import Projects from "./pages/Projects"
import UserProfile from './pages/UserProfile'
import { UserProvider } from "./userContext.jsx"

export default function App() {
  return (
    <>

  <BrowserRouter>
    <UserProvider>
  <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/sign-up" element={<SignUp/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/profile" element={<Profile/>}/>
    <Route path="/dashboard/:id" element={<Dashboard/>}/>
    <Route path="/chat" element={<MessageScreen/>}/>
    <Route path="/jobs" element={<JobsSection/>}/>
    <Route path="/communities" element={<CommunitiesSection/>}/>
    <Route path="/projects" element={<Projects/>}/>
    <Route path="/profile/:userId" element={<UserProfile/>}/>
  </Routes>
    </UserProvider>
  </BrowserRouter>

  </>  
  )
}
