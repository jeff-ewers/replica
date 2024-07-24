export const getUserByEmail = (email) => {
    return fetch(`http://localhost:8000/users?email=${email}`).then((res) =>
      res.json()
    )
  }

export const getUserById = (id) => {
  return fetch(`http://localhost:8000/users/${id}`).then((res) =>
    res.json()
  )
}

export const createUser = (user) => {
  return fetch("http://localhost:8000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  }).then((res) => res.json())
}