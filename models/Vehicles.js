const { default: mongoose } = require("mongoose");

const reqString = {
    type: String,
    require: true,
};
const reqDate = {
    type: Date,
    require: true,
};

const customSchema = new mongoose.Schema({
    Value: Array,
    Comment: { type: String, maxLength: 50}
});
const customRequiredSchema = new mongoose.Schema({
    Value: String,
    Comment: { type: String, maxLength: 50}
});
const customMultipleSchema = new mongoose.Schema({
    Condition: String,
    Value: Array,
    Comment: { type: String, maxLength: 50}
});

const VehicleInformationSchema = new mongoose.Schema({
    Trim: String,
    Body_Type: customRequiredSchema,
    Options: customRequiredSchema,
    Odometer: String,
    Regional_Specs: customRequiredSchema,
    Bank_Finance: customRequiredSchema,
    User_Type: customRequiredSchema,
    Service_History: customRequiredSchema,
    Service_Type: customRequiredSchema,
    Number_Of_Owners: customRequiredSchema,
    Number_Of_Keys: customRequiredSchema,
    Number_Of_Seats: customRequiredSchema,
    Paint_Condition: customRequiredSchema,
    Accident_History: customRequiredSchema,
    Chassis: customRequiredSchema,
    Registered_In_UAE: customRequiredSchema,
    Engine_Type: customRequiredSchema,
    Number_Of_Cylinders: customRequiredSchema,
    Engine_Capacity: String,
    Transmission_Type: customRequiredSchema,
    Powertrain: customRequiredSchema,
});

const LeftSideBodyDetailsSchema  = new mongoose.Schema({
    Front_Fender: customSchema,
    Front_Door: customSchema,
    Rear_Door: customSchema,
    Rear_Fender: customSchema,
});

const RightSideBodyDetailsSchema = new mongoose.Schema({
    Front_Fender: customSchema,
    Front_Door: customSchema,
    Rear_Door: customSchema,
    Rear_Fender: customSchema,
});

const MiddleBodyDetailsSchema = new mongoose.Schema({
    Front_Bumper: customSchema,
    Show_Grill: customMultipleSchema,
    Hood: customSchema,
    Roof: customSchema,
    Trunk_Or_Tailgate: customSchema,
    Rear_Bumper: customSchema,
});

const GlassesSchema = new mongoose.Schema({
    Left_Front_Window: customMultipleSchema,
    Left_Rear_Window: customMultipleSchema,
    Right_Front_Window: customMultipleSchema,
    Right_Rear_Window: customMultipleSchema,
    Sun_Or_Moon_Roof: customMultipleSchema,
    Front_Windshield: customMultipleSchema,
    Rear_Windshield: customMultipleSchema,
});

const LightAndMirrorsSchema = new mongoose.Schema({
    Left_Side_View_Mirror: customMultipleSchema,
    Right_Side_View_Mirror: customMultipleSchema,
    Left_Front_Head_Light: customMultipleSchema,
    Right_Front_Head_Light: customMultipleSchema,
    Left_Tail_Light: customMultipleSchema,
    Right_Tail_Light: customMultipleSchema,
});

const RimsSchema = new mongoose.Schema({
    Front_Left: customMultipleSchema,
    Front_Right: customMultipleSchema,
    Rim_Type: customSchema,
    Rear_Left: customMultipleSchema,
    Rear_Right: customMultipleSchema,
});

const TyresSchema = new mongoose.Schema({
    Front_Left: customMultipleSchema,
    Front_Right: customMultipleSchema,
    Rear_Left: customMultipleSchema,
    Rear_Right: customMultipleSchema,
});

const CarExteriorSchema = new mongoose.Schema({
    Left_Side_Body_Details: LeftSideBodyDetailsSchema,
    Right_Side_Body_Details: RightSideBodyDetailsSchema,
    Middle_Body_Details: MiddleBodyDetailsSchema,
    Glasses: GlassesSchema,
    Light_And_Mirrors: LightAndMirrorsSchema,
    Rims: RimsSchema,
    Tyres: TyresSchema,
});

const CarInteriorSchema = new mongoose.Schema({
    Seat_Type: customSchema,
    Seats_Condition: customMultipleSchema,
    Seat_Belt: customMultipleSchema,
    Sun_Or_Moon_Roof: customMultipleSchema,
    Convertible: customMultipleSchema,
    Steering_Wheel: customMultipleSchema,
    Horn: customMultipleSchema,
    Dashboard: customMultipleSchema,
    AC_Vents: customMultipleSchema,
    Gear_knob: customMultipleSchema,
    Glovebox: customMultipleSchema,
    Console_Box: customMultipleSchema,
    Roof_Liner: customMultipleSchema, 
    Door_Trim_Or_Switches: {
        Front_Left_Door: customMultipleSchema,
        Front_Right_Door: customMultipleSchema,
        Rear_Left_Door: customMultipleSchema,
        Rear_Right_Door: customMultipleSchema,
    },
    Cluster_And_Warning_Lights: {
        Cluster: customMultipleSchema,
        Warning_Lights: customSchema
    },
});

const GeneralDrivingConditionSchema = new mongoose.Schema({
    Air_Conditioning: customMultipleSchema,
    Engine: customMultipleSchema,
    Transmission: customMultipleSchema,
    Turbo_Or_Supercharger: customMultipleSchema,
    Steering: customMultipleSchema,
    Braking_System: customMultipleSchema,
    Shock_Absorbers: customMultipleSchema,
    Rubber_Or_Bushes: customMultipleSchema,
    Drive_Axles: customMultipleSchema,
    Drive_Assist: {
        Front_Sensor: customSchema,
        Distronic: customSchema,
        Lane_Change: customSchema,
        Blindspot: customSchema,
    },
    Park_Assist: {
        Front_Sensor: customSchema,
        Front_Camera: customSchema,
        Rear_Sensor: customSchema,
        Rear_Camera: customSchema,
        Left_Camera: customSchema,
        Right_Camera: customSchema,
    },
});

const TechnicalConditionSchema = new mongoose.Schema({
    Engine_Condition: customMultipleSchema,
    Transmission_Condition: customMultipleSchema,
    Sign_Of_Leakages: customMultipleSchema,
    Exhaust: customMultipleSchema,
});

const VehiclesSchema = new mongoose.Schema({
    Vehicle_Manufacturer: reqString,
    Model: reqString,
    Manufacturing_Year: reqString,
    Year_Of_Registration: reqString,
    Color: reqString,
    Chassis_Number: reqString,
    Registration_Number: reqString,
    Engine_Number: reqString,
    Images: Array,
    Vehicle_Information: VehicleInformationSchema,
    Car_Exterior: CarExteriorSchema,
    Car_Interior: CarInteriorSchema,
    General_Driving_Condition: GeneralDrivingConditionSchema,
    Technical_Condition: TechnicalConditionSchema,
});

const Vehicle = mongoose.model("vehicles", VehiclesSchema);
module.exports = Vehicle;