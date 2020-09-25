const dotenv = require('dotenv')
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Load configuration from dotenv files
dotenv.config();

exports.sendEmail = functions.https.onRequest((request, response) => {
    const from = process.env.FROM_EMAIL;
    const pass = process.env.FROM_PASS;
    const to = process.env.TO_EMAIL;

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: from,
            pass: pass
        }
    });

    const mailOptions = {
        from: `Talking Plants <${from}>`,
        to: to,
        subject: "Test",
        text: "Hello world!"
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            response.send(err.toString());
        } else {
            response.send('Success');
        }
    });
});
