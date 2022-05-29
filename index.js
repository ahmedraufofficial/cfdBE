require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');

const mongoose = require('mongoose');
const VehiclesModel = require('./models/Vehicles');
const AuctionsModel = require('./models/Auctions');
const AdminModel = require('./models/Admin');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../auctionFrontend/public/', 'uploads'),
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

app.post('/add/auction', async (req, res) => {
    const vehicle = await VehiclesModel.findOne({_id: req.body.x.Vehicle_Id})
    const response = req.body.x
    response.Vehicle_Title = vehicle.Vehicle_Manufacturer + " " + vehicle.Model + "(" + vehicle.Manufacturing_Year + ")" 
    response.Current_Bid = response.Auction_Opening_Price
    response.Bids = []
    const auction = new AuctionsModel(response);
    try {
        await auction.save();
        res.send({status: "200"})
    } catch(err) {
        res.send({status: "500", error: err})
    };  
});

app.get('/auctions', async (req, res) => {
    try {
        const auctions = await AuctionsModel.find()
        return res.json({data: auctions})
    } catch (err) {
        console.log(err)
        res.json({ status: "error", error: "Invalid Token"})
    }
});

app.put('/edit/auction/:id', async (req, res) => {
    const update = req.body
    try {
        let check = await AuctionsModel.findOne({_id: req.params.id});
        check.Bids.push(update.Bids)
        update.Bids = check.Bids
        if (check.Current_Bid > update.Current_Bid) { update.Current_Bid = check.Current_Bid }
        let auction = await AuctionsModel.findOneAndUpdate({_id: req.params.id}, update, {new: true})
        res.send({status: "200", response: auction})
    } catch(err) {
        res.send({status: "500", error: err})
    };
});

app.get('/get/auction/:id', async (req, res) => {
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

app.listen(8080, () => {
    console.log('Server running')
});