const express = require("express")
const app = express()
const cors = require("cors")
const user_routes = require("./routes/users_routes")
require("dotenv")
const helmet = require("helmet")

const {PORT} = process.env

//middleware
app.use(helmet({
    crossOriginResourcePolicy : false
}))
app.use(cors({
    origin : "*"
}))
app.use(express.urlencoded({extended : false}))
app.use(express.json())

// routess
app.use("/api", user_routes)

app.listen(PORT, ()=>{
    console.info("server running..")
})

