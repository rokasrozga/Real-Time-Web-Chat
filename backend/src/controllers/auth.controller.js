import { generateToken } from '../lib/utils.js'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js'


export const register = async (req, res) => {
    const {fullname, email, password} = req.body
    try {
        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters long"})
        }

        const user = await User.findOne({email})
        if (user) {
            return res.status(400).json({message: "User already exists"})
        }

        const SALT = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, SALT)

        const newUser = new User({
            fullname: fullname,
            email: email,
            password: hashedPass
        })

        if(newUser) {
            generateToken(newUser._id, res)
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            })
        } else {
            res.status(400).json({message: "Invalid user data"})
        }

    } catch (error) {
        console.log("Error in register", error.message)
        res.status(500).json({message: "Internal server error"})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})

        if(!user) {
            return res.status(400).json({message:"Invalid credentials"})
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect) {
            return res.status(400).json({message:"Invalid credentials"})
        }

        generateToken(user._id, res)
        res.status(200).json({message: "Authentication Successful"})

    } catch (error) {
        console.log("Error in login", error.message)
        res.status(500).json({message: "Internal server error"})
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message: "Successfully logged out"})
    } catch (error) {
        console.log("Error in logout", error.message)
        res.status(500).json({message: "Internal server error"})
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body
        const userId = req.user._id
    
        if(!profilePic) {
            return res.status(400).json({message: "Profile picture is required"})
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new:true})

        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("error in update profile", error.message)
        res.status(500).json({message:"Internal server error"})
    }
}

export const checkAuth = async (req, res) => {
    try{
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth", error.message)
        res.status(500).json({message: "Internal server error"})
    }
}
