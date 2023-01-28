const { default: mongoose } = require("mongoose");

const InquirySchema = new mongoose.Schema({
    Name: {
        type: String,
    },
    Email: {
        type: String,
    },
    Contact_Number: {
        type: String,
    },
    Vehicle: {
        type: String,
    },
    Model_Year: {
        type: String,
    },
    Mileage: {
        type: String
    }
});

const Inquirys = mongoose.model("Inquirys", InquirySchema);
module.exports = Inquirys;