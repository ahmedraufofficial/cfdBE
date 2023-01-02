const { default: mongoose } = require("mongoose");

const CustomerInformationSchema = new mongoose.Schema({
    Contact_Name: {
        type: String,
    },
    Email: {
        type: String,
    },
    Contact_Number: {
        type: String,
    },
    Customer_Location: {
        type: String
    }
})

const CarValuationSchema = new mongoose.Schema({
    Model_Year: {
        type: String,
    },
    Make: {
        type: String
    },
    Global_Model_Name: {
        type: String
    },
    Model_Name: {
        type: String
    },
    Car_Options: {
        type: String
    },
    Mileage: {
        type: String
    },
    Evaluation_Option: {
        type: String
    },
    Booked_by: {
        type: String
    }
})

const AppointmentSchema = new mongoose.Schema({
    Website: {
        type: String,
    },
    Location: {
        type: String,
    },
    Appointment_Date: {
        type: Date,
    },
    Time: {
        type: String,
    },
    User: {
        type: String,
    },
    Valuation_Status: {
        type: String,
    },
    Heard_Us_From: {
        type: String
    },
    Staff_Lead_Source: {
        type: String
    },
    Sell_Option: {
        type: String,
    },
    Last_Updated: {
        type: String
    },
    Customer_Information: CustomerInformationSchema,
    Car_Valuation_Details: CarValuationSchema,
    Additional_Information: {
        type: String
    }
});

const Appointments = mongoose.model("appointments", AppointmentSchema);
module.exports = Appointments;