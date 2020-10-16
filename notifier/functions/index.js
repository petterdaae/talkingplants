const dotenv = require('dotenv')
const functions = require('firebase-functions');
const pg = require('pg');
const admin = require('firebase-admin')
const constants = require('./constants');
const utils = require('./utils');

dotenv.config();
admin.initializeApp();

exports.outOfPowerNotfier = functions.region("europe-west1").pubsub.schedule('every 60 minutes').onRun(async context => {
    const client = new pg.Client({
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        ssl: true
    });
    await client.connect();

    const plants = await client.query("SELECT id, name FROM plant")
    for (let plant of plants.rows) {
        let notifications = await client.query(
            "SELECT timestamp FROM notifications WHERE type=$1 ORDER BY timestamp DESC LIMIT 1",
            ["lowpower:" + plant.id]
        );

        const response = await client.query(
            "SELECT timestamp FROM sensordata WHERE plant=$1 ORDER BY timestamp desc LIMIT 1", [plant.id]
        );

        if (!response.rows || response.rows.length !== 1) {
            console.log(`Plant (id=${plant.id}) is not setup or has not received any data yet`);
            continue;
        }

        if (notifications.rows && notifications.rows.length === 1) {
            let mostRecentNotification = new Date(notifications.rows[0].timestamp);

            let now = new Date();
            let diff = now - mostRecentNotification;

            if (diff < 2 * constants.DAY) {
                console.log(`Skipping low power notification for plant (${plant.id}) because of recent notification`);
                continue;
            }
        }

        let timestamp = new Date(response.rows[0].timestamp)
        let now = new Date();
        let diff = now - timestamp;

        if (diff > 2 * constants.HOUR) {
            await utils.registerNotification(client, "lowpower:" + plant.id)
            await utils.sendNotification(constants.LOW_BATTERY_NOTIFICATION_PAYLOAD(plant.name))
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
        let moisture = await client.query(
            "SELECT data FROM sensordata WHERE plant=$1 ORDER BY timestamp desc LIMIT 1", [plant.id]
        );

        let notifications = await client.query(
            "SELECT timestamp FROM notifications WHERE type=$1 ORDER BY timestamp DESC LIMIT 1",
            ["lowmoisture:" + plant.id]
        );

        if (!moisture.rows || moisture.rows.length !== 1) {
            console.log(`Plant (id=${plant.id}) is not setup or has not received any data yet`);
            continue;
        }

        if (notifications.rows && notifications.rows.length === 1) {
            let mostRecentNotification = new Date(notifications.rows[0].timestamp);
            let now = new Date();
            let diff = now - mostRecentNotification;
            if (diff < 2 * constants.DAY) {
                console.log(`Skipping notification for plant (${plant.id}) because of recent notification`);
                continue;
            }
        }

        let mostRecentMoisture = moisture.rows[0].data;

        if (mostRecentMoisture < 750) {
            await utils.registerNotification(client, "lowmoisture:" + plant.id);
            await utils.sendNotification(constants.LOW_MOISTURE_NOTIFICATION_PAYLOAD(plant.name));
        } else {
            console.log(`Not sending moisture notification because moisture level is ok (moisture=${mostRecentMoisture})`);
        }
    }
    await client.end();
    return null;
});
