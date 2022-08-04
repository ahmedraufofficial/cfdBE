const PDFDocument =  require('pdfkit-table');
const VehiclesModel = require('../models/Vehicles');
const fetch = require('node-fetch');

const fetchImage = async (src) => {
    const response = await fetch(src);
    const image = await response.buffer();
    return image;
};

const pdfier = async (req, res, next) => {
    const vehicle = await VehiclesModel.findOne({_id: req.params.id})
    const generalDetails = { 
        title: '',
        headers: [
            "General Details", "Details"
        ],
        rows: [
            ["Vehicle Manufacturer", vehicle?.Vehicle_Manufacturer],
            ["Model", vehicle?.Model],
            ["Manufacturing Year", vehicle?.Manufacturing_Year],
            ["Year Of Registration",vehicle?.Year_Of_Registration],
            ["Color", vehicle?.Color],
            ["Chassis Number", vehicle?.Chassis_Number],
            ["Registration Number", vehicle?.Registration_Number],
            ["Engine Number", vehicle?.Engine_Number],
        ],
      };
      const vehicleInformation = { 
        title: '',
        headers: [
            "Vehicle Information", "Details", "Comment"
        ],
        rows: [
            ["Trim",vehicle?.Vehicle_Information?.Trim],
            ["Body Type",vehicle?.Vehicle_Information?.Body_Type?.Value,vehicle?.Vehicle_Information?.Body_Type?.Comment],
            ["Options",vehicle?.Vehicle_Information?.Options?.Value,vehicle?.Vehicle_Information?.Options?.Comment],
            ["Odometer",vehicle?.Vehicle_Information?.Odometer],
            ["Regional Specs",vehicle?.Vehicle_Information?.Regional_Specs?.Value,vehicle?.Vehicle_Information?.Regional_Specs?.Comment],
            ["Bank Finance",vehicle?.Vehicle_Information?.Bank_Finance?.Value,vehicle?.Vehicle_Information?.Bank_Finance?.Comment],
            ["User Type",vehicle?.Vehicle_Information?.User_Type?.Value,vehicle?.Vehicle_Information?.User_Type?.Comment],
            ["Service History",vehicle?.Vehicle_Information?.Service_History?.Value,vehicle?.Vehicle_Information?.Service_History?.Comment],
            ["Service Type",vehicle?.Vehicle_Information?.Service_Type?.Value,vehicle?.Vehicle_Information?.Service_Type?.Comment],
            ["Number Of Owners",vehicle?.Vehicle_Information?.Number_Of_Owners?.Value,vehicle?.Vehicle_Information?.Number_Of_Owners?.Comment],
            ["Number Of Keys",vehicle?.Vehicle_Information?.Number_Of_Keys?.Value,vehicle?.Vehicle_Information?.Number_Of_Keys?.Comment],
            ["Number Of Seats",vehicle?.Vehicle_Information?.Number_Of_Seats?.Value,vehicle?.Vehicle_Information?.Number_Of_Seats?.Comment],
            ["Paint Condition",vehicle?.Vehicle_Information?.Paint_Condition?.Value,vehicle?.Vehicle_Information?.Paint_Condition?.Comment],
            ["Accident History",vehicle?.Vehicle_Information?.Accident_History?.Value,vehicle?.Vehicle_Information?.Accident_History?.Comment],
            ["Chassis",vehicle?.Vehicle_Information?.Chassis?.Value,vehicle?.Vehicle_Information?.Chassis?.Comment],
            ["Registered In UAE",vehicle?.Vehicle_Information?.Registered_In_UAE?.Value,vehicle?.Vehicle_Information?.Registered_In_UAE?.Comment],
            ["Engine Type",vehicle?.Vehicle_Information?.Engine_Type?.Value,vehicle?.Vehicle_Information?.Engine_Type?.Comment],
            ["Number Of Cylinders",vehicle?.Vehicle_Information?.Number_Of_Cylinders?.Value,vehicle?.Vehicle_Information?.Number_Of_Cylinders?.Comment],       
            ["Engine Capacity",vehicle?.Vehicle_Information?.Engine_Capacity],        
            ["Transmission Type",vehicle?.Vehicle_Information?.Transmission_Type?.Value,vehicle?.Vehicle_Information?.Transmission_Type?.Comment],
            ["Powertrain",vehicle?.Vehicle_Information?.Powertrain?.Value,vehicle?.Vehicle_Information?.Powertrain?.Comment]
        ],
      }; 
      const leftBody = { 
        title: '',
        headers: [
            "Left Body", "Condition", "Details", "Comment"
        ],
        rows: [
            ["Front Fender",vehicle?.Car_Exterior?.Left_Side_Body_Details?.Front_Fender?.Condition,vehicle?.Car_Exterior?.Left_Side_Body_Details?.Front_Fender?.Value,vehicle?.Car_Exterior?.Left_Side_Body_Details?.Front_Fender?.Comment],
            ["Front Door",vehicle?.Car_Exterior?.Left_Side_Body_Details?.Front_Door?.Condition,vehicle?.Car_Exterior?.Left_Side_Body_Details?.Front_Door?.Value,vehicle?.Car_Exterior?.Left_Side_Body_Details?.Front_Door?.Comment],
            ["Rear Door",vehicle?.Car_Exterior?.Left_Side_Body_Details?.Rear_Door?.Condition,vehicle?.Car_Exterior?.Left_Side_Body_Details?.Rear_Door?.Value,vehicle?.Car_Exterior?.Left_Side_Body_Details?.Rear_Door?.Comment],
            ["Rear Fender",vehicle?.Car_Exterior?.Left_Side_Body_Details?.Left_Side_Body_Details?.Condition,vehicle?.Car_Exterior?.Left_Side_Body_Details?.Rear_Fender?.Value,vehicle?.Car_Exterior?.Left_Side_Body_Details?.Rear_Fender?.Comment],
        ],
      };
      const rightBody = { 
        title: '',
        headers: [
            "Right Body", "Condition", "Details", "Comment"
        ],
        rows: [
            ["Front Fender",vehicle?.Car_Exterior?.Right_Side_Body_Details?.Front_Fender?.Condition,vehicle?.Car_Exterior?.Right_Side_Body_Details?.Front_Fender?.Value,vehicle?.Car_Exterior?.Right_Side_Body_Details?.Front_Fender?.Comment],
            ["Front Door",vehicle?.Car_Exterior?.Right_Side_Body_Details?.Front_Door?.Condition,vehicle?.Car_Exterior?.Right_Side_Body_Details?.Front_Door?.Value,vehicle?.Car_Exterior?.Right_Side_Body_Details?.Front_Door?.Comment],
            ["Rear Door",vehicle?.Car_Exterior?.Right_Side_Body_Details?.Rear_Door?.Condition,vehicle?.Car_Exterior?.Right_Side_Body_Details?.Rear_Door?.Value,vehicle?.Car_Exterior?.Right_Side_Body_Details?.Rear_Door?.Comment],
            ["Rear Fender",vehicle?.Car_Exterior?.Right_Side_Body_Details?.Rear_Fender?.Condition,vehicle?.Car_Exterior?.Right_Side_Body_Details?.Rear_Fender?.Value,vehicle?.Car_Exterior?.Right_Side_Body_Details?.Rear_Fender?.Comment],
        ],
      };
      const middleBody = { 
        title: '',
        headers: [
            "Middle Body", "Condition", "Details", "Comment"
        ],
        rows: [
            ["Front Bumper",vehicle?.Car_Exterior?.Middle_Body_Details?.Front_Bumper?.Condition,vehicle?.Car_Exterior?.Middle_Body_Details?.Front_Bumper?.Value,vehicle?.Car_Exterior?.Middle_Body_Details?.Front_Bumper?.Comment],
            ["Show Grill",vehicle?.Car_Exterior?.Middle_Body_Details?.Show_Grill?.Condition,vehicle?.Car_Exterior?.Middle_Body_Details?.Show_Grill?.Value,vehicle?.Car_Exterior?.Middle_Body_Details?.Show_Grill?.Comment],
            ["Hood",vehicle?.Car_Exterior?.Middle_Body_Details?.Hood?.Condition,vehicle?.Car_Exterior?.Middle_Body_Details?.Hood?.Value,vehicle?.Car_Exterior?.Middle_Body_Details?.Hood?.Comment],
            ["Roof",vehicle?.Car_Exterior?.Middle_Body_Details?.Roof?.Condition,vehicle?.Car_Exterior?.Middle_Body_Details?.Roof?.Value,vehicle?.Car_Exterior?.Middle_Body_Details?.Roof?.Comment],
            ["Trunk Or Tailgate",vehicle?.Car_Exterior?.Middle_Body_Details?.Trunk_Or_Tailgate?.Condition,vehicle?.Car_Exterior?.Middle_Body_Details?.Trunk_Or_Tailgate?.Value,vehicle?.Car_Exterior?.Middle_Body_Details?.Trunk_Or_Tailgate?.Comment],
            ["Rear Bumper",vehicle?.Car_Exterior?.Middle_Body_Details?.Rear_Bumper?.Condition,vehicle?.Car_Exterior?.Middle_Body_Details?.Rear_Bumper?.Value,vehicle?.Car_Exterior?.Middle_Body_Details?.Rear_Bumper?.Comment],
        ],
      };
      const glasses = { 
        title: '',
        headers: [
            "Glasses", "Condition", "Details", "Comment"
        ],
        rows: [
            ["Left Front Window",vehicle?.Car_Exterior?.Glasses?.Left_Front_Window?.Condition,vehicle?.Car_Exterior?.Glasses?.Left_Front_Window?.Value,vehicle?.Car_Exterior?.Glasses?.Left_Front_Window?.Comment],     
            ["Left Rear Window",vehicle?.Car_Exterior?.Glasses?.Left_Rear_Window?.Condition,vehicle?.Car_Exterior?.Glasses?.Left_Rear_Window?.Value,vehicle?.Car_Exterior?.Glasses?.Left_Rear_Window?.Comment],
            ["Right Front Window",vehicle?.Car_Exterior?.Glasses?.Right_Front_Window?.Condition,vehicle?.Car_Exterior?.Glasses?.Right_Front_Window?.Value,vehicle?.Car_Exterior?.Glasses?.Right_Front_Window?.Comment], 
            ["Right Rear Window",vehicle?.Car_Exterior?.Glasses?.Right_Rear_Window?.Condition,vehicle?.Car_Exterior?.Glasses?.Right_Rear_Window?.Value,vehicle?.Car_Exterior?.Glasses?.Right_Rear_Window?.Comment],     
            ["Sun Or Moon Roof",vehicle?.Car_Exterior?.Glasses?.Sun_Or_Moon_Roof?.Condition,vehicle?.Car_Exterior?.Glasses?.Sun_Or_Moon_Roof?.Value,vehicle?.Car_Exterior?.Glasses?.Sun_Or_Moon_Roof?.Comment],
            ["Front Windshield",vehicle?.Car_Exterior?.Glasses?.Front_Windshield?.Condition,vehicle?.Car_Exterior?.Glasses?.Front_Windshield?.Value,vehicle?.Car_Exterior?.Glasses?.Front_Windshield?.Comment],
            ["Rear Windshield",vehicle?.Car_Exterior?.Glasses?.Rear_Windshield?.Condition,vehicle?.Car_Exterior?.Glasses?.Rear_Windshield?.Value,vehicle?.Car_Exterior?.Glasses?.Rear_Windshield?.Comment], 
        ],
      };
      const lights = { 
        title: '',
        headers: [
            "Lights and Mirrors", "Condition", "Details", "Comment"
        ],
        rows: [
            ["Left Side View Mirror",vehicle?.Car_Exterior?.Light_And_Mirrors?.Left_Side_View_Mirror?.Condition,vehicle?.Car_Exterior?.Light_And_Mirrors?.Left_Side_View_Mirror?.Value,vehicle?.Car_Exterior?.Light_And_Mirrors?.Left_Side_View_Mirror?.Comment],
            ["Right Side View Mirror",vehicle?.Car_Exterior?.Light_And_Mirrors?.Right_Side_View_Mirror?.Condition,vehicle?.Car_Exterior?.Light_And_Mirrors?.Right_Side_View_Mirror?.Value,vehicle?.Car_Exterior?.Light_And_Mirrors?.Right_Side_View_Mirror?.Comment],
            ["Left Front Head Light",vehicle?.Car_Exterior?.Light_And_Mirrors?.Left_Front_Head_Light?.Condition,vehicle?.Car_Exterior?.Light_And_Mirrors?.Left_Front_Head_Light?.Value,vehicle?.Car_Exterior?.Light_And_Mirrors?.Left_Front_Head_Light?.Comment],
            ["Right Front Head Light",vehicle?.Car_Exterior?.Light_And_Mirrors?.Right_Front_Head_Light?.Condition,vehicle?.Car_Exterior?.Light_And_Mirrors?.Right_Front_Head_Light?.Value,vehicle?.Car_Exterior?.Light_And_Mirrors?.Right_Front_Head_Light?.Comment],
            ["Left Tail Light",vehicle?.Car_Exterior?.Light_And_Mirrors?.Left_Tail_Light?.Condition,vehicle?.Car_Exterior?.Light_And_Mirrors?.Left_Tail_Light?.Value,vehicle?.Car_Exterior?.Light_And_Mirrors?.Left_Tail_Light?.Comment],
            ["Right Tail Light",vehicle?.Car_Exterior?.Light_And_Mirrors?.Right_Tail_Light?.Condition,vehicle?.Car_Exterior?.Light_And_Mirrors?.Right_Tail_Light?.Value,vehicle?.Car_Exterior?.Light_And_Mirrors?.Right_Tail_Light?.Comment],          
        ],
      };
      const rims = { 
        title: '',
        headers: [
            "Rims", "Condition", "Details", "Comment"
        ],
        rows: [
            ["Front Left",vehicle?.Car_Exterior?.Rims?.Front_Left?.Condition,vehicle?.Car_Exterior?.Rims?.Front_Left?.Value,vehicle?.Car_Exterior?.Rims?.Front_Left?.Comment],
            ["Front Right",vehicle?.Car_Exterior?.Rims?.Front_Right?.Condition,vehicle?.Car_Exterior?.Rims?.Front_Right?.Value,vehicle?.Car_Exterior?.Rims?.Front_Right?.Comment],
            ["Rim Type","",vehicle?.Car_Exterior?.Rims?.Rim_Type?.Value,vehicle?.Car_Exterior?.Rims?.Rim_Type?.Comment],
            ["Rear Left",vehicle?.Car_Exterior?.Rims?.Rear_Left?.Condition,vehicle?.Car_Exterior?.Rims?.Rear_Left?.Value,vehicle?.Car_Exterior?.Rims?.Rear_Left?.Comment],
            ["Rear Right",vehicle?.Car_Exterior?.Rims?.Rear_Right?.Condition,vehicle?.Car_Exterior?.Rims?.Rear_Right?.Value,vehicle?.Car_Exterior?.Rims?.Rear_Right?.Comment],
        ],
      };
      const tyres = { 
        title: '',
        headers: [
            "Tyres", "Condition", "Details", "Comment"
        ],
        rows: [
            ["Front Left",vehicle?.Car_Exterior?.Tyres?.Front_Left?.Condition,vehicle?.Car_Exterior?.Tyres?.Front_Left?.Value,vehicle?.Car_Exterior?.Tyres?.Front_Left?.Comment],
            ["Front Right",vehicle?.Car_Exterior?.Tyres?.Front_Right?.Condition,vehicle?.Car_Exterior?.Tyres?.Front_Right?.Value,vehicle?.Car_Exterior?.Tyres?.Front_Right?.Comment],
            ["Rear Left",vehicle?.Car_Exterior?.Tyres?.Rear_Left?.Condition,vehicle?.Car_Exterior?.Tyres?.Rear_Left?.Value,vehicle?.Car_Exterior?.Tyres?.Rear_Left?.Comment],
            ["Rear Right",vehicle?.Car_Exterior?.Tyres?.Rear_Right?.Condition,vehicle?.Car_Exterior?.Tyres?.Rear_Right?.Value,vehicle?.Car_Exterior?.Tyres?.Rear_Right?.Comment],
        ],
      };
      const carInterior = { 
        title: '',
        headers: [
            "Car Interior", "Condition", "Details", "Comment"
        ],
        rows: [
            ["Seat Type","",vehicle?.Car_Interior?.Seat_Type?.Value,vehicle?.Car_Interior?.Seat_Type?.Comment],
            ["Seats Condition",vehicle?.Car_Interior?.Seats_Condition?.Condition,vehicle?.Car_Interior?.Seats_Condition?.Value,vehicle?.Car_Interior?.Seats_Condition?.Comment],
            ["Seat Belt",vehicle?.Car_Interior?.Seat_Belt?.Condition,vehicle?.Car_Interior?.Seat_Belt?.Value,vehicle?.Car_Interior?.Seat_Belt?.Comment],
            ["Sun Or Moon Roof",vehicle?.Car_Interior?.Sun_Or_Moon_Roof?.Condition,vehicle?.Car_Interior?.Sun_Or_Moon_Roof?.Value,vehicle?.Car_Interior?.Sun_Or_Moon_Roof?.Comment],
            ["Convertible",vehicle?.Car_Interior?.Convertible?.Condition,vehicle?.Car_Interior?.Convertible?.Value,vehicle?.Car_Interior?.Convertible?.Comment],
            ["Steering Wheel",vehicle?.Car_Interior?.Steering_Wheel?.Condition,vehicle?.Car_Interior?.Steering_Wheel?.Value,vehicle?.Car_Interior?.Steering_Wheel?.Comment],
            ["Horn",vehicle?.Car_Interior?.Horn?.Condition,vehicle?.Car_Interior?.Horn?.Value,vehicle?.Car_Interior?.Horn?.Comment], 
            ["Dashboard",vehicle?.Car_Interior?.Dashboard?.Condition,vehicle?.Car_Interior?.Dashboard?.Value,vehicle?.Car_Interior?.Dashboard?.Comment],
            ["AC Vents",vehicle?.Car_Interior?.AC_Vents?.Condition,vehicle?.Car_Interior?.AC_Vents?.Value,vehicle?.Car_Interior?.AC_Vents?.Comment],
            ["Gear knob",vehicle?.Car_Interior?.Gear_knob?.Condition,vehicle?.Car_Interior?.Gear_knob?.Value,vehicle?.Car_Interior?.Gear_knob?.Comment],
            ["Glovebox",vehicle?.Car_Interior?.Glovebox?.Condition,vehicle?.Car_Interior?.Glovebox?.Value,vehicle?.Car_Interior?.Glovebox?.Comment],
            ["Console Box",vehicle?.Car_Interior?.Console_Box?.Condition,vehicle?.Car_Interior?.Console_Box?.Value,vehicle?.Car_Interior?.Console_Box?.Comment],
            ["Roof Liner",vehicle?.Car_Interior?.Roof_Liner?.Condition,vehicle?.Car_Interior?.Roof_Liner?.Value,vehicle?.Car_Interior?.Roof_Liner?.Comment],
            ["Front Left Door",vehicle?.Car_Interior?.Door_Trim_Or_Switches?.Front_Left_Door?.Condition,vehicle?.Car_Interior?.Door_Trim_Or_Switches?.Front_Left_Door?.Value,vehicle?.Car_Interior?.Door_Trim_Or_Switches?.Front_Left_Door?.Comment],
            ["Front Right Door",vehicle?.Car_Interior?.Door_Trim_Or_Switches?.Front_Right_Door?.Condition,vehicle?.Car_Interior?.Door_Trim_Or_Switches?.Front_Right_Door?.Value,vehicle?.Car_Interior?.Door_Trim_Or_Switches?.Front_Right_Door?.Comment],
            ["Rear Left Door",vehicle?.Car_Interior?.Door_Trim_Or_Switches?.Rear_Left_Door?.Condition,vehicle?.Car_Interior?.Door_Trim_Or_Switches?.Rear_Left_Door?.Value,vehicle?.Car_Interior?.Door_Trim_Or_Switches?.Rear_Left_Door?.Comment],
            ["Rear Right Door",vehicle?.Car_Interior?.Door_Trim_Or_Switches?.Rear_Right_Door?.Condition,vehicle?.Car_Interior?.Door_Trim_Or_Switches?.Rear_Right_Door?.Value,vehicle?.Car_Interior?.Door_Trim_Or_Switches?.Rear_Right_Door?.Comment],
            ["Cluster",vehicle?.Car_Interior?.Cluster_And_Warning_Lights?.Cluster?.Condition,vehicle?.Car_Interior?.Cluster_And_Warning_Lights?.Cluster?.Value,vehicle?.Car_Interior?.Cluster_And_Warning_Lights?.Cluster?.Comment], 
            ["Warning Lights",vehicle?.Car_Interior?.Cluster_And_Warning_Lights?.Warning_Lights?.Condition,vehicle?.Car_Interior?.Cluster_And_Warning_Lights?.Warning_Lights?.Value,vehicle?.Car_Interior?.Cluster_And_Warning_Lights?.Warning_Lights?.Comment],
        ],
      };
      const generalDrivingConditions = { 
        title: '',
        headers: [
            "General Driving Conditions", "Condition", "Details", "Comment"
        ],
        rows: [
            ["Air Conditioning",vehicle?.General_Driving_Condition?.Air_Conditioning?.Condition,vehicle?.General_Driving_Condition?.Air_Conditioning?.Value,vehicle?.General_Driving_Condition?.Air_Conditioning?.Comment],
            ["Engine",vehicle?.General_Driving_Condition?.Engine?.Condition,vehicle?.General_Driving_Condition?.Engine?.Value,vehicle?.General_Driving_Condition?.Engine?.Comment],
            ["Transmission",vehicle?.General_Driving_Condition?.Transmission?.Condition,vehicle?.General_Driving_Condition?.Transmission?.Value,vehicle?.General_Driving_Condition?.Transmission?.Comment],
            ["Turbo Or Supercharger",vehicle?.General_Driving_Condition?.Turbo_Or_Supercharger?.Condition,vehicle?.General_Driving_Condition?.Turbo_Or_Supercharger?.Value,vehicle?.General_Driving_Condition?.Turbo_Or_Supercharger?.Comment],
            ["Steering",vehicle?.General_Driving_Condition?.Steering?.Condition,vehicle?.General_Driving_Condition?.Steering?.Value,vehicle?.General_Driving_Condition?.Steering?.Comment],
            ["Braking System",vehicle?.General_Driving_Condition?.Braking_System?.Condition,vehicle?.General_Driving_Condition?.Braking_System?.Value,vehicle?.General_Driving_Condition?.Braking_System?.Comment],
            ["Shock Absorbers",vehicle?.General_Driving_Condition?.Shock_Absorbers?.Condition,vehicle?.General_Driving_Condition?.Shock_Absorbers?.Value,vehicle?.General_Driving_Condition?.Shock_Absorbers?.Comment],
            ["Rubber Or Bushes",vehicle?.General_Driving_Condition?.Rubber_Or_Bushes?.Condition,vehicle?.General_Driving_Condition?.Rubber_Or_Bushes?.Value,vehicle?.General_Driving_Condition?.Rubber_Or_Bushes?.Comment],
            ["Drive Axles",vehicle?.General_Driving_Condition?.Drive_Axles?.Condition,vehicle?.General_Driving_Condition?.Drive_Axles?.Value,vehicle?.General_Driving_Condition?.Drive_Axles?.Comment],
            ["Front Sensor","",vehicle?.General_Driving_Condition?.Drive_Assist?.Front_Sensor?.Value,vehicle?.General_Driving_Condition?.Drive_Assist?.Front_Sensor?.Comment],
            ["Distronic","",vehicle?.General_Driving_Condition?.Drive_Assist?.Distronic?.Value,vehicle?.General_Driving_Condition?.Drive_Assist?.Distronic?.Comment],
            ["Lane Change","",vehicle?.General_Driving_Condition?.Drive_Assist?.Lane_Change?.Value,vehicle?.General_Driving_Condition?.Drive_Assist?.Lane_Change?.Comment],
            ["Blindspot","",vehicle?.General_Driving_Condition?.Drive_Assist?.Blindspot?.Value,vehicle?.General_Driving_Condition?.Drive_Assist?.Blindspot?.Comment],
            ["Front Sensor","",vehicle?.General_Driving_Condition?.Park_Assist?.Front_Sensor?.Value,vehicle?.General_Driving_Condition?.Park_Assist?.Front_Sensor?.Comment],
            ["Front Camera","",vehicle?.General_Driving_Condition?.Park_Assist?.Front_Camera?.Value,vehicle?.General_Driving_Condition?.Park_Assist?.Front_Camera?.Comment],
            ["Rear Sensor","",vehicle?.General_Driving_Condition?.Park_Assist?.Rear_Sensor?.Value,vehicle?.General_Driving_Condition?.Park_Assist?.Rear_Sensor?.Comment],
            ["Rear Camera","",vehicle?.General_Driving_Condition?.Park_Assist?.Rear_Camera?.Value,vehicle?.General_Driving_Condition?.Park_Assist?.Rear_Camera?.Comment],
            ["Left Camera","",vehicle?.General_Driving_Condition?.Park_Assist?.Left_Camera?.Value,vehicle?.General_Driving_Condition?.Park_Assist?.Left_Camera?.Comment],
            ["Right Camera","",vehicle?.General_Driving_Condition?.Park_Assist?.Right_Camera?.Value,vehicle?.General_Driving_Condition?.Park_Assist?.Right_Camera?.Comment],
        ],
      };
      const technicalConditions = { 
        title: '',
        headers: [
            "Technical Conditions", "Condition", "Details", "Comment"
        ],
        rows: [
            ["Engine Condition",vehicle?.Technical_Condition?.Engine_Condition?.Condition,vehicle?.Technical_Condition?.Engine_Condition?.Value,vehicle?.Technical_Condition?.Engine_Condition?.Comment],
            ["Transmission Condition",vehicle?.Technical_Condition?.Transmission_Condition?.Condition,vehicle?.Technical_Condition?.Transmission_Condition?.Value,vehicle?.Technical_Condition?.Transmission_Condition?.Comment],
            ["Sign Of Leakages",vehicle?.Technical_Condition?.Sign_Of_Leakages?.Condition,vehicle?.Technical_Condition?.Sign_Of_Leakages?.Value,vehicle?.Technical_Condition?.Sign_Of_Leakages?.Comment],
            ["Exhaust",vehicle?.Technical_Condition?.Exhaust?.Condition,vehicle?.Technical_Condition?.Exhaust?.Value,vehicle?.Technical_Condition?.Exhaust?.Comment],
        ],
      };



    var myDoc = new PDFDocument({bufferPages: true});
    
    let buffers = [];
    myDoc.on('data', buffers.push.bind(buffers));
    myDoc.on('end', () => {
        let pdfData = Buffer.concat(buffers);
        res.writeHead(200, {
        'Content-Length': Buffer.byteLength(pdfData),
        'Content-Type': 'application/pdf',
        'Content-disposition': 'attachment;filename=test.pdf',})
        .end(pdfData);
    
    });

    await myDoc.text(`${vehicle?.Vehicle_Manufacturer} ${vehicle?.Model} `, {
        width: 410,
        align: 'left'
    });

    await myDoc.text(`${vehicle?.Manufacturing_Year}`, {
        width: 410,
        align: 'left'
    });

    const getImg = await fetchImage(`http://142.93.231.219/images/logo.png`);
    await myDoc.image(getImg, 70, 20, {width: 50});

    myDoc.moveDown();
    await myDoc.text(`Images`, {
        width: 410,
        align: 'left'
    });

    const photosToPdf = vehicle?.Images;
    let positionX = 60;
    let positionY = 140;
    
    for (const img of photosToPdf) {
       if(positionX == 570){
          positionX = 60
          positionY = positionY + 160
       }
       const getImg = await fetchImage(`http://142.93.231.219/images/${img}`);
       await myDoc.image(getImg, positionX, positionY, {width: 150});
       positionX = positionX + 170
       };

    myDoc.addPage();
    await myDoc.text(`Information`, {
        width: 410,
        align: 'left'
    });
    myDoc.moveDown();
    await myDoc.table(generalDetails, {});
    myDoc.moveDown();
    await myDoc.table(vehicleInformation, {});
    myDoc.addPage();
    await myDoc.table(leftBody, {});
    myDoc.moveDown();
    await myDoc.table(rightBody, {});
    myDoc.moveDown();
    await myDoc.table(middleBody, {});
    myDoc.moveDown();
    await myDoc.table(glasses, {});
    myDoc.moveDown();
    await myDoc.table(lights, {});
    myDoc.addPage();
    await myDoc.table(rims, {});
    myDoc.moveDown();
    await myDoc.table(tyres, {});
    myDoc.moveDown();
    await myDoc.table(carInterior, {});
    myDoc.addPage();
    await myDoc.table(generalDrivingConditions, {});
    myDoc.moveDown();
    await myDoc.table(technicalConditions, {});
    
/*     myDoc.text(`This text is left aligned. ${vehicle._id}`, {
        width: 410,
        align: 'left'
      }); */

    myDoc.end();
}

module.exports = {pdfier}