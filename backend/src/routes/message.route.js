import { protectRoute } from "../middleware/auth.middleware.js"
import Message from "../models/message.model.js"
import { getMessages, getUsers, sendMessage } from "../controllers/message.controller.js"
import express from "express"

const router = express.Router()

router.get("/users", protectRoute, getUsers)
router.get("/:id", protectRoute, getMessages)
router.post("/send/:id", protectRoute, sendMessage)

export default router