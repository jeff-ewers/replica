import { Routes, Route, Outlet } from "react-router-dom"
import "./App.css"
import { Login } from "./components/auth/Login.jsx"
import { Register } from "./components/auth/Register.jsx"
import { ApplicationViews } from "./views/ApplicationViews.jsx"
import {Authorized } from "./views/Authorized.jsx"

export const App = () => {
 return (
  <>
  <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} /> 
  <Route path="*" element={
    <Authorized>
      <ApplicationViews />
    </Authorized>
  } />
  </Routes>
  </>
 )
}