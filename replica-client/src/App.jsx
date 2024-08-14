import { Routes, Route } from "react-router-dom"
import "./App.css"
import { Login } from "./components/auth/Login.jsx"
import { Register } from "./components/auth/Register.jsx"
import { ApplicationViews } from "./views/ApplicationViews.jsx"
import { Authorized } from "./views/Authorized.jsx"
import { NavBar } from "./components/nav/NavBar.jsx"

export const App = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="*"
          element={
            <Authorized>
              <div className="main-layout">
                <NavBar />
                <main className="main-content">
                  <ApplicationViews />
                </main>
              </div>
            </Authorized>
          }
        />
      </Routes>
    </div>
  )
}
