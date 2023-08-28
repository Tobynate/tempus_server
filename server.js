require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')



//import routes
const tempusRoute = require('./routes/tempusRoutes')


// start express app
const app = express()


//middleware
app.use((req, res, next) => {
  //console.log(req.path, req.method)
  next()
})
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({
  origin: ["http://localhost:3000", "https://portal.mansoniabay.com", "https://elegant-tapioca-2f1714.netlify.app"],
  credentials: true
}))



//path for image upload
app.use("/uploads", express.static(path.join(__dirname, "uploads")))


//routes middleware
app.use("/api/tempus", tempusRoute)

// routes
app.get("/", (req, res) => {
  res.send("Home Page")
})

//error middleware
//app.use(errorHandler)


//connect to database
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, '0.0.0.0', () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })


