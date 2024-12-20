import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import {io} from "socket.io-client"
export const useAuthStore = create((set, get) => ({
    authUser: null,
    isRegistering: false,
    isLoggingIn: false,
    onlineUsers: [],
    isUpdatingProfile: false,
    isCheckingAuth: true,
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser: res.data})
            get().connectSocket()
        } catch (error) {
            set({authUser: null})
        } finally {
            set({isCheckingAuth:false})
        }
    },

    register: async (data) => {
        set({isRegistering:true})
        try {
            const response = await axiosInstance.post("/auth/register", data)
            toast.success("Account created")
            set({authUser:response.data})
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isRegistering:false})
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({authUser:null})
            toast.success("Logged out")
            get().disconnectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    login: async (data) => {
        set({isLoggingIn:true})
        try{
            const response = await axiosInstance.post("/auth/login", data)
            set({authUser:response.data})
            toast.success("Logged in")
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isLoggingIn:false})
        }
    },

    updateProfile: async (data) => {
        set({isUpdatingProfile:true})
        try {
            const response = await axiosInstance.put("/auth/update-profile", data)
            set({authUser:response.data})
            toast.success("Profile updated")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isUpdatingProfile:false})
        }
    },

    connectSocket: () => {
        const {authUser} = get()
        if (!authUser || get().socket?.connected) return
        const socket = io(import.meta.env.MODE === "development" ? "http://localhost:5000" : "/", {query: {userId: authUser._id}})
        socket.connect()
        set({socket})
    },

    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect()
    },
}))
