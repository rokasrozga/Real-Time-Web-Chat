import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useAuthStore = create((set) => ({
    authUser: null,
    isRegistering: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser: res.data})
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
    }
}))
