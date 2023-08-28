require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const errorHandler = require('./middleWare/errorMiddleware')
const cookieParser = require('cookie-parser')
const path = require('path')



//import routes
const subscriberRoute = require('./routes/subscriberRoutes')
const plotRoute = require('./routes/plotRoutes')
const agentRoute = require('./routes/agentRoutes')
const paymentRoute = require('./routes/paymentRoutes')
const dashboardRoute = require('./routes/dashboardRoutes')
const documentRoute = require('./routes/documentRoutes')


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
app.use("/api/subscriber", subscriberRoute)
app.use("/api/plot", plotRoute)
app.use("/api/agent", agentRoute)
app.use("/api/payment", paymentRoute)
app.use("/api/dashboard", dashboardRoute)
app.use("/api/document", documentRoute)

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


