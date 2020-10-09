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

let LOW_MOISTURE_MAIL_OPTIONS = (name) => ({
    from: `Talking Plants <${process.env.FROM_EMAIL}>`,
    to: process.env.TO_EMAIL,
    subject: `${name} is thirsty!`,
    text: `${name} needs water soon or it will die.`
});

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

    const plants = await client.query("SELECT id FROM plant")

    for (let plant of plants) {
        let id = plant.id;

        const response = await client.query(
            "SELECT timestamp FROM sensordata WHERE plant=$1 ORDER BY timestamp desc", [id]
        );
        let timestamp = new Date(response.rows[0].timestamp)
        let now = new Date();
        let diff = now - timestamp;
        console.log(diff);

        const MINUTE = 60 * 1000;
        const PADDING = 3 * MINUTE;

        if (diff > 70 * MINUTE && diff < 2 * 70 * MINUTE + PADDING) {
            sendEmail(LOW_BATTERY_MAIL_OPTIONS, (err, _) => {
                if (err) {
                    console.error(err.toString());
                } else {
                    console.log('Successfully sent out of power mail.');
                }
            });
        }
    }
    await client.end();
    return null;
});

exports.lowMoistureNotifier = functions.pubsub.schedule("every 70 minutes").onRun(async context => {
    const client = new pg.Client({
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        ssl: true
    });
    await client.connect();

    const plants = await client.query("SELECT name, id FROM plant")

    for (let plant of plants) {
        let id = plant.id;
        let name = plant.name;

        let response = await client.query(
            "SELECT data FROM sensordata WHERE plant=$1 ORDER BY timestamp desc LIMIT 100", [id]
        );

        let moisture = response.rows.map(row => row.data);

        const LIMIT = 900;

        let count = 0;

        for (let data of moisture) {
            if (data > LIMIT) {
                count++;
            }
        }

        if (count === 7) {
            sendEmail(LOW_MOISTURE_MAIL_OPTIONS(name), (err, _) => {
                if (err) {
                    console.error(err.toString());
                } else {
                    console.log('Successfully sent low moisture mail.');
                }
            });
        }
    }
    await client.end();
    return null;
});
