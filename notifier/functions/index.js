const dotenv = require('dotenv')
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const pg = require('pg');

dotenv.config();

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

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

async function registerNotification(client, type) {
    await client.query("INSERT INTO notifications (type) VALUES ($1)", [type]);
}

exports.outOfPowerNotfier = functions.region("europe-west1").pubsub.schedule('every 70 minutes').onRun(async context => {
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

    for (let plant of plants.rows) {
        let id = plant.id;

        const response = await client.query(
            "SELECT timestamp FROM sensordata WHERE plant=$1 ORDER BY timestamp desc LIMIT 1", [id]
        );

        if (
            !response.rows ||
            response.rows.length !== 1
        ) {
            console.log(`Plant (id=${id}) is not setup or has not received any data yet`);
            continue;
        }

        let timestamp = new Date(response.rows[0].timestamp)
        let now = new Date();
        let diff = now - timestamp;

        const PADDING = 3 * MINUTE;

        if (diff > 70 * MINUTE && diff < 2 * 70 * MINUTE + PADDING) {
            registerNotification(client, "lowpower:" + id)
            sendEmail(LOW_BATTERY_MAIL_OPTIONS, (err, _) => {
                if (err) {
                    console.error(err.toString());
                } else {
                    console.log('Successfully sent out of power mail');
                }
            });
        }
    }
    await client.end();
    return null;
});

exports.lowMoistureNotifier = functions.region("europe-west1").pubsub.schedule("every 60 minutes").onRun(async context => {
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

    for (let plant of plants.rows) {
        let id = plant.id;
        let name = plant.name;

        let moisture = await client.query(
            "SELECT data FROM sensordata WHERE plant=$1 ORDER BY timestamp desc LIMIT 1", [id]
        );

        let notifications = await client.query(
            "SELECT timestamp FROM notifications WHERE type=$1 ORDER BY timestamp DESC LIMIT 1",
            ["lowmoisture:" + id]
        );

        if (
            !moisture.rows ||
            moisture.rows.length !== 1
        ) {
            console.log(`Plant (id=${id}) is not setup or has not received any data yet`);
            continue;
        }

        if (notifications.rows && notifications.rows.length === 1) {
            let mostRecentNotification = new Date(notifications.rows[0].timestamp);

            let now = new Date();
            let diff = now - mostRecentNotification;

            if (diff < 2 * DAY) {
                console.log(`Skipping notification for plant (${id}) because of recent notification`);
                continue;
            }
        }

        let mostRecentMoisture = moisture.rows[0].data;

        if (mostRecentMoisture < 500) {
            await registerNotification(client, "lowmoisture:" + id);
            sendEmail(LOW_MOISTURE_MAIL_OPTIONS(name), (err, _) => {
                if (err) {
                    console.error(err.toString());
                } else {
                    console.log('Successfully sent low moisture mail');
                }
            });
        } else {
            console.log(`Not sending moisture notification because moisture level is ok (moisture=${mostRecentMoisture})`);
        }
    }
    await client.end();
    return null;
});
