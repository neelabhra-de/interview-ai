const express = require('express')
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())

// Configure CORS to accept local dev, explicit frontend URLs, and Vercel preview domains.
const allowedOrigins = new Set(
    [
        "http://localhost:5173",
        process.env.FRONTEND_URL,
        "https://interview-ai-green.vercel.app",
        ...(process.env.FRONTEND_URLS || "")
            .split(",")
            .map((origin) => origin.trim())
            .filter(Boolean)
    ].filter(Boolean)
)

function isAllowedVercelPreview(origin) {
    try {
        const url = new URL(origin)
        return url.protocol === "https:" && url.hostname.endsWith(".vercel.app")
    } catch {
        return false
    }
}

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin) || isAllowedVercelPreview(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true
}))

// require all the routes here

const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")




/*using all the routes here*/

// Health check endpoint for monitoring services (UptimeRobot, etc.)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    })
})

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

app.use((err, req, res, next) => {
    if (err.name === "MulterError") {
        const message = err.code === "LIMIT_FILE_SIZE" ? "Resume PDF must be 3MB or smaller." : err.message
        return res.status(400).json({ message })
    }

    if (err.message === "Please upload a PDF resume only.") {
        return res.status(400).json({ message: err.message })
    }

    console.error(err)
    res.status(500).json({
        message: err.message || "Something went wrong."
    })
})


module.exports = app
