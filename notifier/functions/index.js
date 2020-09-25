const dotenv = require('dotenv')
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const pg = require('pg');

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

exports.outOfPowerNotfier = functions.pubsub.schedule('every 70 minutes').onRun(async context => {
    const client = new pg.Client({
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        ssl: true
    });
    await client.connect();
    const response = await client.query("SELECT timestamp FROM sensordata WHERE plant=10 ORDER BY timestamp desc");
    let timestamp = new Date(response.rows[0].timestamp)
    let now = new Date();
    let diff = now - timestamp;
    console.log(diff);

    const MINUTE = 60 * 1000;
    const PADDING = 10 * MINUTE;

    if (diff > 70 * MINUTE && diff < 2 * 70 * MINUTE + PADDING) {
        sendEmail(LOW_BATTERY_MAIL_OPTIONS, (err, _) => {
            if (err) {
                console.error(err.toString());
            } else {
                console.log('Success');
            }
        });
    }

    await client.end();
    return null;
});
