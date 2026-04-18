const express = require('express')
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// require all the routes here

const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")




/*using all the routes here*/ 

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
