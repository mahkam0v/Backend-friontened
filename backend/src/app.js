import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import userRoutes from "./routes/user.routes.js"
import todoRoutes from "./routes/todo.routes.js"
import { AppDataSource } from "./config/data-source.js"
import { startBot } from "./bot/bot.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002

// Middleware-lar
app.use(express.json())
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://todo-app-seven-xi-21.vercel.app"
  ],
  credentials: true,
}))
app.use("/uploads", express.static("uploads"))

// Router-lar
app.use("/api/users", userRoutes)
app.use("/api/todos", todoRoutes)

app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    error: err.message || "Internal server error",
  })
})

const startServer = async () => {
  try {
    await AppDataSource.initialize()
    console.log("🚀 Postgres TypeORM orqali ulandi")

    // await startBot()
    // console.log("🤖 Telegram bot ishga tushdi")

    app.listen(PORT, () => {
      console.log(`📡 Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("❌ Server ishga tushishda xatolik:", error.message)
    process.exit(1)
  }
}

startServer()