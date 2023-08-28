const { Router } = require("express")
const express = require("express")
const { protect, adminOnly } = require('../middleWare/authMiddleware')

// import controllers

//subscriber controllers
const { signup, loginSubscriber, logoutSubscriber, createSubscriber, getSubscriber, getLoggedInSubscriber, loginStatus, updateSubscriber, changePassword, forgotPassword, resetPassword, deleteSubscriber, getSubscribers, sendAutomatedEmail, verifyOtp } = require("../controllers/subscriberController")



//create Router
const router = express.Router()

//subscriber sign up route
router.post("/signup", signup)

//subscriber sign in route
router.post("/login", loginSubscriber)

//logged in status
router.post("/loggedin", loginStatus)

//get logged in subscriber details
router.get("/getsubscriber", protect, getLoggedInSubscriber)

//get all subscriber details
router.get("/getsubscriberdata", protect, getSubscriber)

//Subscriber  forgot password 
router.post("/forgotpassword", forgotPassword)

//verify subscriber otp
router.post("/verifyotp", verifyOtp)

//Subscriber to reset password
router.patch("/resetpassword", resetPassword)



//subscriber log out route
router.get("/logout", logoutSubscriber)

//subscriber creation route by admin
router.post("/createsubscriber", createSubscriber)


//admin to edit subscriber details
router.patch("/updatesubscriber/:id", protect, adminOnly, updateSubscriber)

//admin to edit subscriber password
router.patch("/changepassword", protect, changePassword)





//Send email to reset password


//admin to delete subscriber
router.delete("/:id", protect, adminOnly, deleteSubscriber)

//get all subscribers
router.get("/getsubscribers", protect, adminOnly, getSubscribers)

//send automated emails
router.post("/sendAutomatedEmail", protect, sendAutomatedEmail)





module.exports = router