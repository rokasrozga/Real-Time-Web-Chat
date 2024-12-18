import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProfilePage from "./pages/ProfilePage"
import { useEffect } from "react"
import { useAuthStore } from "./store/useAuthStore"
import {Loader} from "lucide-react"
import {Toaster} from "react-hot-toast"
const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore()
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if(isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin"/>
    </div>
  )
  console.log({authUser})
  return(
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login"/>}/>
        <Route path="/register" element={!authUser ? <RegisterPage /> : <Navigate to="/"/>}/>
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/"/>}/>
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login"/>}/>
      </Routes>

      <Toaster />
    </div>
  )
}

export default App