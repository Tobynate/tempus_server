
const asyncHandler = require('express-async-handler')

const mongoose = require('mongoose');



//import tempus Model
const tempus = require('../models/tempusModel')




// Sign up of tempus
const getTemperature = asyncHandler(async (req, res) => {


    res.send(
        "hi"
    )

})



module.exports = {
    getTemperature,

}