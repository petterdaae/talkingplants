const dotenv = require('dotenv')
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

dotenv.config();

const LOW_BATTERY_MAIL_OPTIONS = {
    from: `Talking Plants <${process.env.FROM_EMAIL}>`,
    to: process.env.TO_EMAIL,
    subject: "No more power",
    text: "Your plant has not been talking for a while. It is probably out of power."
};

function sendEmail(options, callback) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.FROM_EMAIL,
            pass: process.env.FROM_PASS
        }
    });
    transporter.sendMail(options, callback);
}

exports.sendEmail = functions.https.onRequest((_, response) => {
    sendEmail(LOW_BATTERY_MAIL_OPTIONS, (err, _) => {
        if (err) {
            response.send(err.toString());
        } else {
            response.send('Success');
        }

    });
});
