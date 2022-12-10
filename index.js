require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const moment = require('moment');
const mongoose = require('mongoose');
const EvaluationsModel = require('./models/Evaluations');
const NegotiationsModel = require('./models/Negotiations');
const AuctionsModel = require('./models/Auctions');
const AdminModel = require('./models/Admin');
const UserModel = require('./models/Users');
const ClassifiedsModel = require('./models/Classifieds');
const NotificationModel = require('./models/Notification');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'llc.carology@gmail.com',
      pass: 'qgxenzpjdnnowipw'
    }
});

const { signup, login, isAuth, contact, accounts, activate, generateOtp, resetPassword } = require('./controllers/auth.js');
const { userNotification, usersNotificationApi, userNotificationApi, userNotificationId, userNotificationUsername } = require('./controllers/notifications.js')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static('images'));

const storage = multer.diskStorage({
    destination: path.join(__dirname, './', 'images'),
    filename: function (req, file, cb) {  
        // null as first argument means no error
        cb(null, Date.now() + '-' + file.originalname )  
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            //return cb(new Error('File type not accepted (.png, .jpg, .jpeg)'));
        }
    }
});
 
mongoose.connect('mongodb+srv://carfairdeal:ahmedrauf1@cluster0.qisse7b.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
});



app.get('/notifications/:id', async (req, res) => {
    try {
        let notifications = await NotificationModel.find({Device_Id: req.params.id, status: 'active'});
        if (notifications.length > 0) {
            await NotificationModel.updateMany({Device_Id: req.params.id}, {status: 'sent'});
        }
        res.send({status: "200", response: notifications})
    } catch(err) {
        res.send({status: "500", error: err})
    };
});

app.get('/notification/all/:id', async (req, res) => {
    try {
        let notifications = await NotificationModel.find({Device_Id: req.params.id});
        res.send({status: "200", response: notifications})
    } catch(err) {
        res.send({status: "500", error: err})
    };
});


app.post("/upload_classified_images", upload.array("files",8), uploadClassifiedFiles);
async function uploadClassifiedFiles(req, res) {
    const update = {Images: req.files.map((file) => file.filename)}
    //await ClassifiedsModel.findOneAndUpdate({_id: req.body.id}, update, {new: true})
    req.files?.length > 0 ?
    res.json({ message: update }) : res.json( {message: "Something went wrong"})
}

app.get('/classifieds', async (req, res) => {
    try {
        const classifieds = await ClassifiedsModel.find()
        return res.json({data: classifieds})
    } catch (err) {
        console.log(err)
        res.json({ status: "error", error: "Invalid Token"})
    }
});

app.post('/add/classifieds', async (req, res) => {
    const classified = new ClassifiedsModel(req.body.values);
    try {
        await classified.save();
        res.send({status: "200"})
    } catch(err) {
        res.send({status: "500", error: err})
    };  
});

app.get('/classifieds/:id', async (req, res) => {
    try {
        let classified = await ClassifiedsModel.findOne({_id: req.params.id});
        res.send({status: "200", response: classified})
    } catch(err) {
        res.send({status: "500", error: err})
    };
});

app.put('/edit/classifieds/:id', async (req, res) => {
    const update = req.body.values
    try {
        const x = await ClassifiedsModel.findOneAndUpdate({_id: req.params.id}, update, {new: true})
        res.send({status: "200"})
    } catch(err) {
        res.send({status: "500", error: err})
    };
});


app.get('/email', async (req, res) => {

    var mailOptions = {
        from: 'llc.carology@gmail.com',
        to: 'arky99992@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };

    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
    res.send({status: "200"})
});

app.post('/add/negotiation', async (req, res) => {
    const auction = await NegotiationsModel.findOne({Auction_Id: req.body.Auction_Id})
    if (!auction) {
        const negotiation = new NegotiationsModel(req.body);
        try {
            await negotiation.save();
            res.send({status: "200"})
        } catch(err) {
            res.send({status: "500", error: err})
        };  
    } else {
        res.send({status: "500", error: "Something went wrong"})
    }
});

app.get('/negotiations', async (req, res) => {
    try {
        const negotiations = await NegotiationsModel.find()
        return res.json({data: negotiations})
    } catch (err) {
        console.log(err)
        res.json({ status: "error", error: "Invalid Token"})
    }
});

app.get('/prenegotiations', async (req, res) => {
    const auctions = await AuctionsModel.find({"Status": "Pre-Negotiation"})
    for (let i = 0; i < auctions.length; i++) {
        const auction = auctions[i]
        if (new Date(moment(auction?.Auction_Start_Date).format("YYYY-MM-DD")+" "+auction?.Auction_Start_Time+":00").getTime() + 60000 * parseInt(auction.Total_Bidding_Duration) <= new Date(new Date().setHours(new Date().getHours() + 4)).getTime()) {
            const values = {
                Auction_Id: auction?._id,
                Auction_Type: auction?.Auction_Type,
                Vehicle_Id: auction?.Vehicle_Id,
                Product_Description: auction?.Product_Description,
                Currency: auction?.Currency,
                Current_Bid: auction?.Current_Bid,
                Negotiation_Duration: auction?.Negotiation_Duration,
                Negotiation_Mode: auction?.Negotiation_Mode,
                Set_Incremental_Price: auction?.Set_Incremental_Price,
                Vehicle_Title: auction?.Vehicle_Title,
                Status: auction?.Status,
                Bids: auction?.Bids,
                Images: auction?.Images
            }
        if (auction?.Negotiation_Mode === "automatic") {
            values.Buy_Now_Price = auction?.Current_Bid;
            values.Negotiation_Start_Date = new Date(new Date().setHours(new Date().getHours() + 4));
            }
        const negotiation = new NegotiationsModel(values);
        try {
            await negotiation.save()
            await AuctionsModel.findOneAndUpdate({_id: auction?._id}, {Status: "Negotiation"}, {new: true})
        } catch (err) {
            return res.json({failed: err})
        }
        }    
    }
    const negotiations = await NegotiationsModel.find()
    return res.json({data: negotiations})
})

app.put('/edit/negotiation/:id', async (req, res) => {
    const update = req.body
    try {
        let negotiation = await NegotiationsModel.findOneAndUpdate({_id: req.params.id}, update, {new: true})
        res.send({status: "200", response: negotiation})
    } catch(err) {
        res.send({status: "500", error: err})
    };
});

async function PostNegotiation(id, duration, start, username, vehicleId){
    if ((new Date(start).getTime() + 60000 * parseInt(duration)) <= new Date(new Date().setHours(new Date().getHours() + 4)).getTime()) {
        await NegotiationsModel.findOneAndUpdate({_id: id}, {Status: "Post-Negotiation"}, {new: true})
        await VehiclesModel.findOneAndUpdate({_id: vehicleId}, {Auction_Winner: username, Status: 'Post-Negotiation'}, {new: true})
        const user = await UserModel.findOne({username: username})
        if (user) {
            userNotification("Auction Won!", "A Vehicle has been added to your cart", user.Device_Id)
        }
    }
};

app.get('/negotiation/:id', async (req, res) => {
    try {
        let negotiation = await NegotiationsModel.findOne({_id: req.params.id});
        if (negotiation?.Buy_Now_Price && negotiation?.Status === "Pre-Negotiation") {
            await PostNegotiation(negotiation._id, negotiation.Negotiation_Duration, negotiation.Negotiation_Start_Date, negotiation?.Bids.length > 0 ? negotiation?.Bids[negotiation?.Bids?.length - 1].user : null, negotiation.Vehicle_Id)
        }
        res.send({status: "200", response: negotiation})
    } catch(err) {
        res.send({status: "500", error: err})
    };
});

app.get('/negotiation/vehicle/:id', async (req, res) => {
    try {
        let negotiation = await NegotiationsModel.findOne({Vehicle_Id: req.params.id});
        res.send({status: "200", response: negotiation})
    } catch(err) {
        res.send({status: "500", error: err})
    };
});

app.get('/invoices', async (req, res) => {
    try {
        const invoices = await NegotiationsModel.find({Status: "Post-Negotiation"}); 
        return res.json({data: invoices})
    } catch (err) {
        console.log(err)
        res.json({ status: "error", error: "Invalid Token"})
    }
});

app.get('/invoices/:name', async (req, res) => {
    try {
        let vehicles = await VehiclesModel.find({Auction_Winner: req.params.name});
        res.send({status: "200", response: vehicles})
    } catch(err) {
        res.send({status: "500", error: err})
    };
});

app.post('/add/auction', async (req, res) => {
    const vehicle = await VehiclesModel.findOne({_id: req.body.x.Vehicle_Id})
    const response = req.body.x
    response.Vehicle_Title = vehicle.Vehicle_Manufacturer + " " + vehicle.Model + " (" + vehicle.Manufacturing_Year + ")" 
    response.Images = vehicle.Images
    response.Current_Bid = response.Auction_Opening_Price
    response.Bids = []
    response.Status = "Pre-Negotiation"
    response.Recent_Auto_Bid = new Date()
    const auction = new AuctionsModel(response);
    try {
        await auction.save();
        res.send({status: "200"})
    } catch(err) {
        res.send({status: "500", error: err})
    };  
});

async function autoBid(auctions){
    auctions.map(async (auction)=>{
        if (JSON.parse(auction?.Allow_Auto_Bidding) && auction?.Status === "Pre-Negotiation" &&
            (((new Date().getTime() - auction.Recent_Auto_Bid.getTime())/ 1000) / 60) > 2){
            if ((parseInt(auction?.Current_Bid) < parseInt(auction[auction?.Stop_Auto_Bidding_Condition]||"100000000"))){
                await AuctionsModel.findOneAndUpdate({_id: auction?._id}, {
                    Current_Bid: (parseInt(auction?.Current_Bid) + parseInt(auction?.Set_Incremental_Price)).toString(),
                    Recent_Auto_Bid: new Date()
                }, {new: true})
            } else {
                console.log("First")
                await AuctionsModel.findOneAndUpdate({_id: auction?._id}, {
                    Allow_Auto_Bidding: "false"
                }, {new: true})
            }
        } else if (JSON.parse(auction?.Allow_Auto_Bidding) == false){
            null
        } else if (auction?.Status == "Negotiation") {
            await AuctionsModel.findOneAndUpdate({_id: auction?._id}, {
                Allow_Auto_Bidding: "false"
            }, {new: true})
        } 
    })
}

app.get('/auctions', async (req, res) => {
    try {
        const auctions = await AuctionsModel.find()
        autoBid(auctions)
        return res.json({data: auctions})
    } catch (err) {
        console.log(err)
        res.json({ status: "error", error: "Invalid Token"})
    }
});

async function setIncrementalPrice(auction){
    if (JSON.parse(auction.Allow_Auction_Sniping)){
        const initialTime = new Date(moment(auction?.Auction_Start_Date).format("YYYY-MM-DD")+" "+auction?.Auction_Start_Time+":00").getTime() + 60000 * parseInt(auction.Total_Bidding_Duration)
        /* new Date().setHours(new Date().getHours() + 4) */
        const currentTime = new Date().getTime();
        const timeDiff = ((((initialTime - currentTime) / 1000) / 60) - 0.2).toString().split(".");
        if (parseInt(timeDiff[0]) === 0 && parseInt(timeDiff[1]) > 0) {
            const duration = parseInt(auction?.Total_Bidding_Duration) + parseInt(auction?.Incremental_Time);
            await AuctionsModel.findOneAndUpdate({_id: auction?._id}, {
                Total_Bidding_Duration: duration.toString(),
            }, {new: true})
        }
    }
}

app.put('/edit/auction/:id', async (req, res) => {
    const update = req.body
    try {
        let check = await AuctionsModel.findOne({_id: req.params.id});
        if (parseInt(check.Current_Bid) > parseInt(update.Current_Bid)) { update.Current_Bid = check.Current_Bid }
        const auction = await AuctionsModel.findOneAndUpdate({_id: req.params.id}, update, {new: true})
        setIncrementalPrice(auction);
        res.send({status: "200", response: auction})
    } catch(err) {
        res.send({status: "500", error: err})
    };
});

app.put('/editadmin/auction/:id', async (req, res) => {
    const update = req.body.x
    try {
        const auction = await AuctionsModel.findOneAndUpdate({_id: req.params.id}, update, {new: true})
        res.send({status: "200", response: auction})
    } catch(err) {
        res.send({status: "500", error: err})
    };
});

app.get('/auction/:id', async (req, res) => {
    try {
        let auction = await AuctionsModel.findOne({_id: req.params.id});
        res.send({status: "200", response: auction})
    } catch(err) {
        res.send({status: "500", error: err})
    };
});

app.post("/upload_images", upload.array("files",8), uploadFiles);
async function uploadFiles(req, res) {
    const update = {Images: req.files.map((file) => file.filename)}
    await VehiclesModel.findOneAndUpdate({_id: req.body.id}, update, {new: true})
    await AuctionsModel.updateMany({Vehicle_Id: req.body.id}, update, {new: true})
    await NegotiationsModel.updateMany({Vehicle_Id: req.body.id}, update, {new: true})
    req.files?.length > 0 ?
    res.json({ message: "Successfully uploaded files" }) : res.json( {message: "Something went wrong"})
}


app.post('/add/evaluations', async (req, res) => {
    const vehicle = new EvaluationModel(req.body.x);
    try {
        await vehicle.save();
        res.send({status: "200"})
    } catch(err) {
        res.send({status: "500", error: err})
    };  
});

app.put('/edit/evaluations/:id', async (req, res) => {
    const update = req.body.values
    try {
        const x = await EvaluationsModel.findOneAndUpdate({_id: req.params.id}, update, {new: true})
        res.send({status: "200"})
    } catch(err) {
        res.send({status: "500", error: err})
    };
});

app.get('/evaluations', cors(), async (req, res) => {
    try {
        const evaluations = await EvaluationsModel.find()
        return res.json({data: evaluations})
    } catch (err) {
        console.log(err)
        res.json({ status: "error", error: "Invalid Token"})
    }
});

app.get('/evaluation/:id', async (req, res) => {
    try {
        const evaluation = await EvaluationsModel.findOne({_id: req.params.id})
        return res.json({data: evaluation})
    } catch (err) {
        console.log(err)
        res.json({ status: "error", error: "Invalid Token"})
    }
});

app.post('/api/auth', async (req, res) => {
    
    const user = await AdminModel.findOne(req.body)
    if (user) {
        const token = jwt.sign({
            username: req.body.username
        }, 'carology')
        return res.json({ status: 'Exists', user: token })
    };
    return res.json({ status: 'Error', user: false })
});

app.get('/api/quote', async (req, res) => {
    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, 'carology')
        const username = decoded.username
        const user = await AdminModel.findOne({username: username})
        return res.json({ status: 'verified' })
    } catch (err) {
        console.log(err)
        res.json({ status: "error", error: "Invalid Token"})
    }
});

app.post('/api/createuser', async (req, res) => {
    try {
        const User = new AdminModel(req.body)
        await User.save()
        res.json({ status: 'ok' })
    } catch (err) {
        console.log(err)
    }
});

app.post('/login', login);
app.post('/register', signup);
app.get('/private', isAuth);
app.get('/contact/:username', contact);
app.get('/accounts', accounts);
app.post('/forgot-password', generateOtp);
app.post('/reset-password', resetPassword);
app.post('/accounts/activate', activate);
app.post('/broadcast', usersNotificationApi);
app.post('/p2p', userNotificationApi);
app.post('/deviceid', userNotificationId);
app.post('/deviceusername', userNotificationUsername);

app.get('/', async (req, res) => {
    try {
        return res.json({status: "running"})
    } catch (err) {
        res.json({ status: "error"})
    }
});

app.listen(5000,'127.0.0.1', () => {
    console.log(new Date())
});