exports.LOW_BATTERY_MAIL_OPTIONS = {
    from: `Talking Plants <${process.env.FROM_EMAIL}>`,
    to: process.env.TO_EMAIL,
    subject: "No more power",
    text: "Your plant has not been talking for a while. It is probably out of power."
};

exports.LOW_BATTERY_NOTIFICATION_PAYLOAD = (name) => ({
    notification: {
        title: `${name} is out of power!`,
        body: `${name} has not been tallking for a while. It is probably out of power.`,
    },
    data: {
        "click_action": "FLUTTER_NOTIFICATION_CLICK"
    }
});

exports.LOW_MOISTURE_MAIL_OPTIONS = (name) => ({
    from: `Talking Plants <${process.env.FROM_EMAIL}>`,
    to: process.env.TO_EMAIL,
    subject: `${name} is thirsty!`,
    text: `${name} needs water soon or it will die.`
});

exports.LOW_MOISTURE_NOTIFICATION_PAYLOAD = (name) => ({
    notification: {
        title: `${name} is thirsty!`,
        body: `${name} needs water soon or it will die.`,
    },
    data: {
        "click_action": "FLUTTER_NOTIFICATION_CLICK"
    }
});

exports.MINUTE = 60 * 1000;
exports.HOUR = 60 * exports.MINUTE;
exports.DAY = 24 * exports.HOUR;
