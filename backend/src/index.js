import express from 'express'
import authRoutes from './routes/auth.route.js'
import { connectDB } from './lib/db.js'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"
import messageRoutes from "./routes/message.route.js"
import cors from "cors"

dotenv.config()
const app = express()
app.use(express.json({limit: '10mb'}))
const PORT = process.env.PORT

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())


app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})