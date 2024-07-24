
import { useState, useEffect } from "react"
import { UserViews } from "./UserViews.jsx"



export const ApplicationViews = () => {

const [currentUser, setCurrentUser] = useState({});

useEffect(() => {
  const localReplicaUser = localStorage.getItem("replica_user");
  const replicaUserObject = JSON.parse(localReplicaUser);
  setCurrentUser(replicaUserObject);
}, [])

  return (
  <UserViews currentUser={currentUser} /> 
  ) 

      
    
}
