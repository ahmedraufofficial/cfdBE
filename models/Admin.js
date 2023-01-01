const { default: mongoose } = require("mongoose");

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: Array
    }
});

const Admin = mongoose.model("admins", AdminSchema);
module.exports = Admin;