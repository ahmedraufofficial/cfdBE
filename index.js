require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const moment = require('moment');
const mongoose = require('mongoose');
const VehiclesModel = require('./models/Vehicles');
const NegotiationsModel = require('./models/Negotiations');
const AuctionsModel = require('./models/Auctions');
const AdminModel = require('./models/Admin');

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
 
mongoose.connect('mongodb+srv://carology:0Y8Yey4V8suX4aWZ@carology.czjjg.mongodb.net/carology?retryWrites=true&w=majority', {
    useNewUrlParser: true,
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
        if (new Date(moment(auction?.Auction_Start_Date).format("YYYY-MM-DD")+" "+auction?.Auction_Start_Time+":00").getTime() + 60000 * parseInt(auction.Total_Bidding_Duration) <= new Date().getTime()) {
            const values = {
                Auction_Id: auction?._id,
                Auction_Type: auction?.Auction_Type,
                Product_Description: auction?.Product_Description,
                Currency: auction?.Currency,
                Current_Bid: auction?.Current_Bid,
                Negotiation_Duration: auction?.Negotiation_Duration,
                Negotiation_Mode: auction?.Negotiation_Mode,
                Set_Incremental_Price: auction?.Set_Incremental_Price,
                Vehicle_Title: auction?.Vehicle_Title,
                Status: auction?.Status,
                Bids: auction?.Bids
            }
        if (auction?.Negotiation_Mode === "automatic") {
            values.Buy_Now_Price = auction?.Current_Bid;
            values.Negotiation_Start_Date = new Date();
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

app.get('/negotiation/:id', async (req, res) => {
    try {
        let negotiation = await NegotiationsModel.findOne({_id: req.params.id});
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

app.post('/add/auction', async (req, res) => {
    const vehicle = await VehiclesModel.findOne({_id: req.body.x.Vehicle_Id})
    const response = req.body.x
    response.Vehicle_Title = vehicle.Vehicle_Manufacturer + " " + vehicle.Model + "(" + vehicle.Manufacturing_Year + ")" 
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
        if (JSON.parse(auction?.Allow_Auto_Bidding) && 
            (((new Date().getTime() - auction.Recent_Auto_Bid.getTime())/ 1000) / 60) > 2){
            if ((parseInt(auction?.Current_Bid) < parseInt(auction[auction?.Stop_Auto_Bidding_Condition]||"100000000"))){
                await AuctionsModel.findOneAndUpdate({_id: auction?._id}, {
                    Current_Bid: (parseInt(auction?.Current_Bid) + parseInt(auction?.Set_Incremental_Price)).toString(),
                    Recent_Auto_Bid: new Date()
                }, {new: true})
            } else {
                await AuctionsModel.findOneAndUpdate({_id: auction?._id}, {
                    Allow_Auto_Bidding: "false"
                }, {new: true})
            }
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
        if (check.Current_Bid > update.Current_Bid) { update.Current_Bid = check.Current_Bid }
        const auction = await AuctionsModel.findOneAndUpdate({_id: req.params.id}, update, {new: true})
        setIncrementalPrice(auction);
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
    req.files?.length > 0 ?
    res.json({ message: "Successfully uploaded files" }) : res.json( {message: "Something went wrong"})
}

app.post('/add/vehicle', async (req, res) => {
    const vehicle = new VehiclesModel(req.body.x);
    try {
        await vehicle.save();
        res.send({status: "200"})
    } catch(err) {
        res.send({status: "500", error: err})
    };  
});

app.put('/edit/vehicle/:id', async (req, res) => {
    const update = req.body.values
    try {
        await VehiclesModel.findOneAndUpdate({_id: req.params.id}, update, {new: true})
        res.send({status: "200"})
    } catch(err) {
        res.send({status: "500", error: err})
    };
});

app.get('/vehicles', cors(), async (req, res) => {
    try {
        const vehicles = await VehiclesModel.find()
        return res.json({data: vehicles})
    } catch (err) {
        console.log(err)
        res.json({ status: "error", error: "Invalid Token"})
    }
});

app.get('/vehicle/:id', async (req, res) => {
    try {
        const vehicle = await VehiclesModel.findOne({_id: req.params.id})
        return res.json({data: vehicle})
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

app.get('/', async (req, res) => {
    try {
        return res.json({status: "running"})
    } catch (err) {
        res.json({ status: "error"})
    }
});

app.listen(3000, () => {
    console.log('Server running')
});