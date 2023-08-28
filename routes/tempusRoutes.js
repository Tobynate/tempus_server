const { Router } = require("express")
const express = require("express")

// import controllers

//tempus controllers
const { getTemperature } = require("../controllers/tempusController")



//create Router
const router = express.Router()

//tempus sign up route
router.post("/getTemperature", getTemperature)



module.exports = router