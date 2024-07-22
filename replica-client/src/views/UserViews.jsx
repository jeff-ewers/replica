import { Routes, Route, Outlet } from "react-router-dom"
import { NavBar } from "../components/nav/NavBar.jsx"
import { Home } from "../components/home/Home.jsx"



export const UserViews = ({currentUser}) => {
    return <Routes>
                <Route 
            path="/" 
            element={
                <>
                <NavBar />
                <Outlet />
                </>
            }
            >
                <Route index element={<Home />} />
                {/* <Route path="tickets" element={<TicketList currentUser={currentUser}/>}/> */}
            </Route>

        </Routes>
}