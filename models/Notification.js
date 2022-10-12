const { default: mongoose } = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    Device_Id: String,
    notification: String,
    status: String,
    time: Date,
});

const Notification = mongoose.model("notifications", NotificationSchema);
module.exports = Notification;