const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')


//import Subscriber Model
const Subscriber = require('../models/subscriberModel')


const protect = asyncHandler(async (req, res, next) => {

    const token = req.header('x-auth-token')

    if (!token) {
        res.status(401).json({ msg: 'Please login again' });
        return;
    }

    //Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET)

    if (!verified) {
        res.status(401).json({ msg: 'Access Denied' });
        return;
    }

    // Get subscriber Details (- password) from the database using the token as ID 
    const subscriber = await Subscriber.findById(verified._id).select("-password")

    if (!subscriber) {
        if (!verified) {
            res.status(401).json({ msg: 'Account not found' });
            return;
        }

    }

    req.subscriber = subscriber
    req.token = token

    next();

})

const adminOnly = asyncHandler(async (req, res, next) => {

    if (req.subscriber && req.subscriber.role === "Admin") {
        next()
    } else {
        throw new Error("You need admin authorization")
    }

})

module.exports = {
    protect,
    adminOnly
}