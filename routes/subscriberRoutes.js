const { Router } = require("express")
const express = require("express")

// import controllers

//subscriber controllers
const { signup } = require("../controllers/subscriberController")



//create Router
const router = express.Router()

//subscriber sign up route
router.post("/signup", signup)



module.exports = router