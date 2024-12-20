import Message from "../models/message.model.js"
import User from "../models/user.model.js"
import cloudinary from "../lib/cloudinary.js"
import { getRecieverSocketId, io } from "../lib/socket.js"

export const getUsers = async (req, res) => {
    try {
        const self = req.user._id
        const filteredUsers = await User.find({_id: {$ne: self}}).select("-password")

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in getUsers", error.message)
        res.status(500).json({message: "Internal server error"})
    }
}

export const getMessages = async (req, res) => {
    try {
        const {id} = req.params
        const senderId = req.user._id

        const messages = await Message.find({
            $or: [
                {senderId:senderId, receiverId:id},
                {senderId:id, receiverId:senderId}
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages", error.message)
        res.status(500).json({message: "Internal server error"})
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body
        const {id} = req.params
        const senderId = req.user._id

        let imageUrl
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId: senderId,
            receiverId: id,
            text: text,
            image: imageUrl
        })

        await newMessage.save()

        const receiverSocketId = getRecieverSocketId(id)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }
        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage", error.message)
        res.status(500).json({message: "Internal server error"})
    }
}