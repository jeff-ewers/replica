import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Login.css"
import { loginUser } from "../../services/authService"

export const Login = () => {
  const [username, setUsername] = useState("jsmith")  // Changed from email to username
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await loginUser(username, password)
      if (response.user && response.user.id) {
        localStorage.setItem(
          "replica_user",
          JSON.stringify({
            id: response.user.id,
            isActive: response.user.is_active,
            token: response.token
          })
        )
        navigate("/")
      } else {
        window.alert("Invalid login")
      }
    } catch (error) {
      console.error("Login error:", error)
      window.alert("An error occurred during login")
    }
  }

  return (
    <main className="container-login">
      <section>
        <form className="form-login" onSubmit={handleLogin}>
          <h1>Replica</h1>
          <h2>Please sign in</h2>
          <fieldset>
            <div className="form-group">
              <input
                type="text"
                value={username}
                onChange={(evt) => setUsername(evt.target.value)}
                className="form-control"
                placeholder="Username"
                required
                autoFocus
              />
            </div>
          </fieldset>
          <fieldset>
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(evt) => setPassword(evt.target.value)}
                className="form-control"
                placeholder="Password"
                required
              />
            </div>
          </fieldset>
          <fieldset>
            <div className="form-group">
              <button className="login-btn btn-info" type="submit">
                Sign in
              </button>
            </div>
          </fieldset>
        </form>
      </section>
      <section>
        <Link to="/register">Not a member yet?</Link>
      </section>
    </main>
  )
}