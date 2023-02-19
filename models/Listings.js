const { default: mongoose } = require("mongoose");

const ListingSchema = new mongoose.Schema({
    Contact_Name: {
        type: String,
    },
    Email: {
        type: String,
    },
    Contact_Number: {
        type: String,
    },
    Make: {
        type: String,
    },
    Model_Name: {
        type: String,
    },
    Model_Year: {
        type: String,
    },
    Mileage: {
        type: String
    },
    Car_Options: {
        type: String,
    },
    Price: {
        type: String,
    },
    Images: {
        type: Array,
    },
    Description: {
        type: String,
    }
});

const Listings = mongoose.model("Listings", ListingSchema);
module.exports = Listings;