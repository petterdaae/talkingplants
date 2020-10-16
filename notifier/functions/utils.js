const nodemailer = require('nodemailer');
const admin = require('firebase-admin')

exports.sendEmail = (options, callback) => {
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

exports.sendNotification = async (payload) => {
    let response = await admin.messaging().sendToTopic(
        "main",
        payload
    );
    if (response.error) {
        console.error(response.error);
    } else {
        console.log("successfully sent notification", response);
    }
}

exports.registerNotification = async (client, type) => {
    await client.query("INSERT INTO notifications (type) VALUES ($1)", [type]);
}
