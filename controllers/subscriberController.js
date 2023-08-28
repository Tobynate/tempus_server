
const asyncHandler = require('express-async-handler')

const mongoose = require('mongoose');



//import Subscriber Model
const Subscriber = require('../models/subscriberModel')




// Sign up of Subscriber
const signup = asyncHandler(async (req, res) => {


    res.send(
        "hi"
    )

})



module.exports = {
    signup,

}