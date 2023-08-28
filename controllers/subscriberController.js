const validator = require('validator')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const mongoose = require('mongoose');
const otpGenerator = require('otp-generator');



//import Subscriber Model
const Subscriber = require('../models/subscriberModel')

//import Token model
const Token = require('../models/tokenModel')
const sendEmail = require('../utils/sendEmail')

//funtion to generate token
const generateToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '1d' })
}



// Sign up of Subscriber
const signup = asyncHandler(async (req, res) => {


    try {
        const { fileNumber, name, email, password } = req.body


        //Validations
        if (!fileNumber || !email || !password) {

            res.status(400).json({ msg: 'Please fill all fields' });
            return;
        }
        if (!validator.isEmail(email)) {
            res.status(400).json({ msg: 'Invalid email' });
            return;
        }
        if (!validator.isStrongPassword(password)) {
            res.status(400).json({ msg: 'Password not strong enough' });
            return;
        }

        //check if email already exists
        const exists = await Subscriber.findOne({ email })

        if (exists) {
            res.status(400).json({ msg: 'Email already in use' });
            return;
        }



        //Register new subscriber
        const subscriber = await Subscriber.create({
            fileNumber,
            email,
            password
        })

        // Generate Token
        const token = generateToken(subscriber._id)


        if (subscriber) {
            const { _id, firstName, lastName, email, department, role } = subscriber
            res.status(200).json({
                _id, firstName, fileNumber, lastName, email, department, role, token
            })

        }


    } catch (error) {

        console.log(error);
        res.status(500).json({ msg: 'Internal server error' });

    }

})

// Log in of Subscriber
const loginSubscriber = asyncHandler(async (req, res) => {

    try {
        const { email, password } = req.body

        //Validations
        if (!email || !password) {
            res.status(400).json({ msg: 'Please fill all fields' });
            return;
        }
        if (!validator.isEmail(email)) {
            res.status(400).json({ msg: 'Invalid email' });
            return;
        }

        //check if subscriber already exists
        const subscriber = await Subscriber.findOne({ email })

        if (!subscriber) {
            res.status(400).json({ msg: 'Wrong Email or Password' });
            return;
        }

        if (!subscriber.password) {
            res.status(400).json({ msg: 'Wrong Email or Password' });
            return;
        }

        //subscriber exists, check if password is correct
        const passwordIsCorrect = await bcrypt.compare(password, subscriber.password)

        // Generate Token
        const token = generateToken(subscriber._id)


        if (subscriber && passwordIsCorrect) {
            const { _id, firstName, lastName, email, department, role } = subscriber
            res.status(200).json({
                token, _id, firstName, lastName, email, department, role
            })
        } else {
            res.status(400).json({ msg: 'Wrong Email or Password' });
            return;
        }
    } catch (error) {

        console.log(error);
        res.status(500).json({ msg: 'Internal server error' });
    }

})

//check subscriber log in status
const loginStatus = asyncHandler(async (req, res) => {

    try {
        const token = req.header('x-auth-token')

        if (!token) {
            return res.json(false)
        }

        //Verify Token
        const verified = jwt.verify(token, process.env.JWT_SECRET)

        if (!verified) {
            return res.json(false)
        }

        const subscriber = await Subscriber.findById(verified._id)

        if (!subscriber) {
            return res.json(false)
        }

        if (verified) {
            return res.json(true)
        }

        return res.json(false)


    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal server error' });

    }
})

// create subscriber by admin
const createSubscriber = asyncHandler(async (req, res) => {

    const { firstName, lastName, email, password, department, role } = req.body

    // Validations
    if (!email || !password || !firstName || !lastName || !department || !role) {
        res.status(400);
        throw new Error('Please fill all fields');
    }
    if (!validator.isEmail(email)) {
        res.status(400);
        throw new Error('Invalid email');
    }

    // Check if email domain is valid
    const validDomains = ['orangeislandng.com', 'mansoniabay.com'];
    const emailDomain = email.split('@')[1];
    if (!validDomains.includes(emailDomain)) {
        res.status(400);
        throw new Error('Email domain is not allowed');
    }

    // Check if email already exists
    const exists = await Subscriber.findOne({ email });

    if (exists) {
        res.status(400);
        throw new Error('Subscriber already exists');
    }

    // Create new subscriber
    const subscriber = await Subscriber.create({
        firstName,
        lastName,
        email,
        password,
        department,
        role
    });

    if (subscriber) {
        res.status(200).json({ message: "Subscriber created successfully" });
    } else {
        res.status(400);
        throw new Error('Invalid subscriber data');
    }
})

//get all  Subscriber Data
const getSubscriber = asyncHandler(async (req, res) => {


    const subscriber = await Subscriber.findById(req.subscriber).select("-password")

    if (subscriber) {
        res.status(200).json({
            ...subscriber._doc, token: req.token
        })

    } else {
        if (!verified) {
            res.status(401).json({ msg: 'Account not Found' });
            return;
        }
    }


})

//get logged in Subscriber Data
const getLoggedInSubscriber = asyncHandler(async (req, res) => {


    const subscriber = await Subscriber.findById(req.subscriber).select("-password")

    if (subscriber) {
        res.status(200).json({
            ...subscriber._doc, token: req.token
        })

    } else {
        if (!verified) {
            res.status(401).json({ msg: 'Account not Found' });
            return;
        }
    }


})

//Subscriber forgot Password
const forgotPassword = asyncHandler(async (req, res) => {

    const { email } = req.body

    //First set of validations
    if (!email) {
        res.status(400).json({ msg: 'Please enter your email address' });
        return;
    }

    if (!validator.isEmail(email)) {
        res.status(400).json({ msg: 'Enter a valid email address' });
        return;
    }

    const subscriber = await Subscriber.findOne({ email })

    //validations
    if (!subscriber) {
        res.status(400).json({ msg: 'Account not found, Kindly contact IT Support' });
        return;
    }

    //delete token if it exists in the database
    let token = await Token.findOne({ subscriberId: subscriber._id })

    if (token) {
        await token.deleteOne()
    }


    //create otp 
    const otpTokenGenerated = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });


    //Save reset token to database
    await new Token({
        subscriberId: subscriber._id,
        token: otpTokenGenerated,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * (60 * 1000) // expires in 10 mins
    }).save()


    //Send Reset Email    
    const subject = "Password Reset Request - Mansonia Bay"
    const send_to = subscriber.email
    const sent_from = process.env.EMAIL_USER
    const reply_to = process.env.EMAIL_REPLY
    const template = "forgotPassword"

    const name = subscriber.name
    const otpToken = otpTokenGenerated



    try {
        await sendEmail(subject, template, send_to, sent_from, reply_to, name, otpToken)
        res.status(200).json({ success: true, message: "Password Reset Email Sent" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Please try again' });
    }

})

//verify subscriber otp
const verifyOtp = asyncHandler(async (req, res) => {

    const { otpToken } = req.body


    //find token in database
    const subscriberToken = await Token.findOne({
        token: otpToken,
        expiresAt: { $gt: Date.now() }
    })

    if (!subscriberToken) {
        res.status(400).json({ msg: 'Invalid or expired Token' });
        return;
    }

    //find subscriber
    const subscriber = await Subscriber.findOne({ _id: subscriberToken.subscriberId })

    res.status(200).json({
        _id: subscriber._id
    });

})


//Subscriber Reset Password
const resetPassword = asyncHandler(async (req, res) => {



    const { password, id } = req.body

    //validations
    if (!password) {
        res.status(400).json({ msg: 'Password field cannot be empty' });
        return;
    }

    if (!validator.isStrongPassword(password)) {
        res.status(400).json({ msg: 'New Password not strong enough' });
        return;
    }

    //find subscriber
    const subscriber = await Subscriber.findById(id)

    //set subscriber password
    subscriber.password = password
    await subscriber.save()
    res.status(200).json({ message: "Password Reset Successful, please login" });

})

//logout user
const logoutSubscriber = asyncHandler(async (req, res) => {

    // expire HTTP-only cookie
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0), //expire immediately
        sameSite: "none",
        secure: true
    })

    res.status(200).json({ message: "Sucessfully Logged Out" })


})




// Admin to update subscriber
const updateSubscriber = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const subscriber = await Subscriber.findById(id);
    if (!subscriber) {
        res.status(404).json({ message: 'Subscriber not found' });
        return;
    }

    const { firstName, lastName, department, role, password } = req.body;

    if (password !== undefined && password !== null && password !== '') {
        subscriber.password = password;
    }

    subscriber.set({
        firstName,
        lastName,
        email: subscriber.email,
        department,
        role,
    });

    await subscriber.save();

    res.status(200).json({ message: 'Subscriber updated successfully' });

})

//Admin to change subscriber password
const changePassword = asyncHandler(async (req, res) => {

    const subscriber = await Subscriber.findById(req.subscriber._id)
    const { oldPassword, password } = req.body

    //validations

    if (!subscriber) {
        res.status(400);
        throw new Error('Subscriber not found, Create account')
    }

    if (!validator.isStrongPassword(password)) {
        res.status(400);
        throw new Error('New Password not strong enough');
    }

    if (!oldPassword || !password) {
        res.status(400);
        throw new Error('Please enter Old and New Passwords')
    }

    if (oldPassword === password) {
        res.status(400);
        throw new Error('Old and New Password cannot be the same')
    }

    //check if old password is correct
    const passwordIsCorrect = await bcrypt.compare(oldPassword, subscriber.password)

    //save new password
    if (subscriber && passwordIsCorrect) {
        subscriber.password = password
        await subscriber.save()
        res.status(200).send("Password Changed Successfully")
    } else {
        res.status(400);
        throw new Error('Old password is incorrect')
    }
})





//admin to delete subscriber account
const deleteSubscriber = asyncHandler(async (req, res) => {

    const subscriber = Subscriber.findById(req.params.id)

    if (!subscriber) {
        res.status(404);
        throw new Error('This account does not exists')
    }

    await subscriber.remove()

    res.status(200).json({
        message: "Subscriber deleted Successfully"
    })
})


// admin to get all subscribers
const getSubscribers = asyncHandler(async (req, res) => {

    const subscribers = await Subscriber.find().sort("-createdAt").select("-password")

    if (!subscribers) {
        res.status(500);
        throw new Error('Something went wrong, Try again')
    }

    res.status(200).json(subscribers)
})


// send automated email
const sendAutomatedEmail = asyncHandler(async (req, res) => {

    const { subject, template, send_to, reply_to, url } = req.body

    if (!subject || !template || !send_to || !reply_to) {
        res.status(404);
        throw new Error('Missing email parameter')
    }

    // Get Subscriber
    const subscriber = await Subscriber.findOne({ email: send_to })

    if (!subscriber) {
        res.status(404);
        throw new Error('Subscriber not found')
    }

    const sent_from = process.env.EMAIL_USER
    const name = subscriber.firstName.concat(" ", subscriber.lastName) || `${subscriber.firstName} ${subscriber.lastName}`
    const link = `${process.env.FRONTEND_URL}${url}`

    try {

        await sendEmail(subject, template, send_to, sent_from, reply_to, name, link)
        res.status(200).json({ message: "Email Sent" })

    } catch (error) {
        res.status(404);
        throw new Error('Email not sent, please try again')
    }

})

module.exports = {
    signup,
    loginSubscriber,
    logoutSubscriber,
    createSubscriber,
    getSubscriber,
    getLoggedInSubscriber,
    loginStatus,
    updateSubscriber,
    changePassword,
    forgotPassword,
    verifyOtp,
    resetPassword,
    deleteSubscriber,
    getSubscribers,
    sendAutomatedEmail
}