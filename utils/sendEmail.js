const nodemailer = require("nodemailer")
const hbs = require('nodemailer-express-handlebars');
const nodemailerSendgrid = require('nodemailer-sendgrid')
const path = require('path')



const sendEmail = async (subject, template, send_to, sent_from, reply_to, name, otpToken) => {


    // email transporter
    const transporter = nodemailer.createTransport(
        nodemailerSendgrid({
            apiKey: process.env.SENDGRID_API_KEY
        })
    )

    const handlebarOption = {
        viewEngine: {
            extName: ".handlebars",
            partialsDir: path.resolve('./views'),
            defaultLayout: false
        },
        viewPath: path.resolve('./views'),
        extName: ".handlebars"
    }

    transporter.use("compile", hbs(handlebarOption))

    console.log(otpToken)

    const options = {
        from: sent_from,
        to: send_to,
        replyTo: reply_to,
        subject: subject,
        template,
        context: {
            name,
            otpToken,
        }
    }



    // send email
    transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info)
        }
    })

}


module.exports = sendEmail