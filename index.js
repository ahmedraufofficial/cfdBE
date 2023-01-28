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
const AppointmentsModel = require('./models/Appointments')
const NegotiationsModel = require('./models/Negotiations');
const AuctionsModel = require('./models/Auctions');
const AdminModel = require('./models/Admin');
const InspectionsModel = require('./models/Inspections');
const UserModel = require('./models/Users');
const ClassifiedsModel = require('./models/Classifieds');
const NotificationModel = require('./models/Notification');
const InquirysModel = require('./models/Inquirys');
const ListingsModel = require('./models/Listings');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'llc.carology@gmail.com',
      pass: 'qgxenzpjdnnowipw'
    }
});
const cheerio = require('cheerio');
const request = require('request');

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

app.post('/add/user', async (req, res) => {
    try {
        const User = new AdminModel(req.body.x)
        await User.save()
        res.json({ status: "200" })
    } catch (err) {
        console.log(err)
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await AdminModel.find()
        res.json({ data: users })
    } catch (err) {
        console.log(err)
    }
});

app.get('/usernames', async (req, res) => {
    try {
        const users = await AdminModel.find()
        const usernames = users.map((x) => {
            return x.username
        })
        res.json({ data: usernames })
    } catch (err) {
        console.log(err)
    }
});

app.get('/user/:id', async (req, res) => {
    try {
        let auction = await AdminModel.findOne({_id: req.params.id});
        res.send({status: "200", response: auction})
    } catch(err) {
        res.send({status: "500", error: err})
    };
});

app.put('/edit/user/:id', async (req, res) => {
    const update = req.body.x
    try {
        const auction = await AdminModel.findOneAndUpdate({_id: req.params.id}, update, {new: true})
        res.send({status: "200", response: auction})
    } catch(err) {
        res.send({status: "500", error: err})
    };
});

app.post('/add/auction', async (req, res) => {
    const vehicle = await InspectionsModel.findOne({_id: req.body.x.Vehicle_Id})
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
        if (JSON.parse(auction.Allow_Auto_Bidding) && auction.Status === "Pre-Negotiation" && (((new Date().getTime() - auction.Recent_Auto_Bid.getTime())/ 1000) / 60) > 2){
            if ((parseInt(auction.Current_Bid) < parseInt(auction[auction.Stop_Auto_Bidding_Condition]||"100000000"))){
                await AuctionsModel.findOneAndUpdate({_id: auction._id}, {
                    Current_Bid: (parseInt(auction.Current_Bid) + parseInt(auction.Set_Incremental_Price)).toString(),
                    Recent_Auto_Bid: new Date()
                }, {new: true})
            } else {
                await AuctionsModel.findOneAndUpdate({_id: auction._id}, {
                    Allow_Auto_Bidding: "false"
                }, {new: true})
            }
        } else if (JSON.parse(auction.Allow_Auto_Bidding) == false){
            null
        } else if (auction.Status == "Completed") {
            await AuctionsModel.findOneAndUpdate({_id: auction._id}, {
                Allow_Auto_Bidding: "false"
            }, {new: true})
        } 
    })
}

app.get('/prenegotiations', async (req, res) => {
    const auctions = await AuctionsModel.find({"Status": "Pre-Negotiation"})
    for (let i = 0; i < auctions.length; i++) {
        const auction = auctions[i]
        if (new Date(moment(auction.Auction_Start_Date).format("YYYY-MM-DD")+" "+auction.Auction_Start_Time+":00").getTime() + 60000 * parseInt(auction.Total_Bidding_Duration) <= new Date(new Date().setHours(new Date().getHours() + 4)).getTime()) {
        try {
            await AuctionsModel.findOneAndUpdate({_id: auction._id}, {Status: "Completed"}, {new: true})
        } catch (err) {
            return res.json({failed: err})
        }
        }    
    }
    return res.json({status: 200})
})

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

app.put('/edit/auction/:id', async (req, res) => {
    const update = req.body
    try {
        let check = await AuctionsModel.findOne({_id: req.params.id});
        if (parseInt(check.Current_Bid) > parseInt(update.Current_Bid)) { update.Current_Bid = check.Current_Bid }
        const auction = await AuctionsModel.findOneAndUpdate({_id: req.params.id}, update, {new: true})
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
    await InspectionsModel.findOneAndUpdate({_id: req.body.id}, update, {new: true})
    await AuctionsModel.updateMany({Vehicle_Id: req.body.id}, update, {new: true})
    req.files.length > 0 ?
    res.json({ message: "Successfully uploaded files" }) : res.json( {message: "Something went wrong"})
}

app.post('/add/evaluation', async (req, res) => {
    const evaluation = new EvaluationsModel(req.body.x);
    try {
        await evaluation.save();
        res.send({status: "200"})
    } catch(err) {
        res.send({status: "500", error: err})
    };  
});

app.post('/add/inquiry', async (req, res) => {
    const inquiry = new InquirysModel(req.body);
    try {
        await inquiry.save();
        res.send({status: "200"})
    } catch(err) {
        res.send({status: "500", error: err})
    };  
});

app.get('/inquirys', cors(), async (req, res) => {
    try {
        const inquirys = await InquirysModel.find()
        return res.json({data: inquirys})
    } catch (err) {
        console.log(err)
        res.json({ status: "error", error: "Invalid Token"})
    }
});

app.post('/add/listing', async (req, res) => {
    const listing = new ListingsModel(req.body);
    try {
        await listing.save();
        res.send({status: "200"})
    } catch(err) {
        res.send({status: "500", error: err})
    };  
});

app.get('/listings', cors(), async (req, res) => {
    try {
        const listings = await ListingsModel.find()
        return res.json({data: listings})
    } catch (err) {
        console.log(err)
        res.json({ status: "error", error: "Invalid Token"})
    }
});

app.get('/listings/all/:email', cors(), async (req, res) => {
    try {
        const listings = await ListingsModel.find({Email: req.params.email});
        return res.json({data: listings})
    } catch (err) {
        console.log(err)
        res.json({ status: "error", error: "Invalid Token"})
    }
});

app.get('/listings/:id', cors(), async (req, res) => {
    try {
        const listings = await ListingsModel.findOne({_id: req.params.id});
        return res.json({data: listings})
    } catch (err) {
        console.log(err)
        res.json({ status: "error", error: "Invalid Token"})
    }
});

app.delete('/listings/:id', cors(), async (req, res) => {
    try {
        const listings = await ListingsModel.deleteOne({_id: req.params.id});
        return res.json({data: listings})
    } catch (err) {
        console.log(err)
        res.json({ status: "error", error: "Invalid Token"})
    }
});

app.put('/edit/evaluation/:id', async (req, res) => {
    const update = req.body.x
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

app.delete('/evaluation/:id', async (req, res) => {
    try {
        await EvaluationsModel.deleteOne({_id: req.params.id})
        return res.json({data: "success"})
    } catch (err) {
        console.log(err)
        res.json({ status: "error", error: "Invalid Token"})
    }
});

app.post('/add/appointment', async (req, res) => {
    const appointment = new AppointmentsModel(req.body.x);
    try {
        await appointment.save();
        res.send({status: "200"})
    } catch(err) {
        res.send({status: "500", error: err})
    };  
});

app.put('/edit/appointment/:id', async (req, res) => {
    const update = req.body.x
    try {
        const x = await AppointmentsModel.findOneAndUpdate({_id: req.params.id}, update, {new: true})
        res.send({status: "200"})
    } catch(err) {
        res.send({status: "500", error: err})
    };
});

app.get('/appointments', cors(), async (req, res) => {
    try {
        const appointments = await AppointmentsModel.find()
        return res.json({data: appointments})
    } catch (err) {
        console.log(err)
        res.json({ status: "error", error: "Invalid Token"})
    }
});

app.get('/appointment/:id', async (req, res) => {
    try {
        const appointment = await AppointmentsModel.findOne({_id: req.params.id})
        return res.json({data: appointment})
    } catch (err) {
        console.log(err)
        res.json({ status: "error", error: "Invalid Token"})
    }
});

app.delete('/appointment/:id', async (req, res) => {
    try {
        await AppointmentsModel.deleteOne({_id: req.params.id})
        return res.json({data: "success"})
    } catch (err) {
        console.log(err)
        res.json({ status: "error", error: "Invalid Token"})
    }
});

app.post('/add/inspection', async (req, res) => {
    const inspection = new InspectionsModel(req.body.x);
    try {
        await inspection.save();
        res.send({status: "200"})
    } catch(err) {
        res.send({status: "500", error: err})
    };  
});

app.put('/edit/inspection/:id', async (req, res) => {
    const update = req.body.x
    try {
        const x = await InspectionsModel.findOneAndUpdate({_id: req.params.id}, update, {new: true})
        res.send({status: "200"})
    } catch(err) {
        res.send({status: "500", error: err})
    };
});

app.get('/inspections', cors(), async (req, res) => {
    try {
        const inspections = await InspectionsModel.find()
        return res.json({data: inspections})
    } catch (err) {
        console.log(err)
        res.json({ status: "error", error: "Invalid Token"})
    }
});

app.get('/inspection/:id', async (req, res) => {
    try {
        const inspection = await InspectionsModel.findOne({_id: req.params.id})
        return res.json({data: inspection})
    } catch (err) {
        console.log(err)
        res.json({ status: "error", error: "Invalid Token"})
    }
});

app.put('/last_seen/inspection/:id', async (req, res) => {
    const update = req.body
    try {
        const x = await InspectionsModel.findOneAndUpdate({_id: req.params.id}, update, {new: true})
        res.send({status: "200"})
    } catch(err) {
        res.send({status: "500", error: err})
    };
});

app.put('/last_seen/evaluation/:id', async (req, res) => {
    const update = req.body
    try {
        const x = await EvaluationsModel.findOneAndUpdate({_id: req.params.id}, update, {new: true})
        res.send({status: "200"})
    } catch(err) {
        res.send({status: "500", error: err})
    };
});

app.put('/last_seen/appointment/:id', async (req, res) => {
    const update = req.body
    try {
        const x = await AppointmentsModel.findOneAndUpdate({_id: req.params.id}, update, {new: true})
        res.send({status: "200"})
    } catch(err) {
        res.send({status: "500", error: err})
    };
});

app.post('/api/auth', async (req, res) => {
    
    const user = await AdminModel.findOne(req.body)
    if (user) {
        const token = jwt.sign({
            username: req.body.username
        }, 'carology')
        return res.json({ status: 'Exists', user: token, roles: user.roles })
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

const getHtml = (make, model, year) => {
    var options = {
        'method': 'GET',
        'url': `https://www.truecar.com/used-cars-for-sale/listings/${make.toLowerCase()}/${model.toLowerCase().replace(' ','-')}/year-${year}`,
    };
    console.log(options)
    return new Promise((resolve, reject) => {
      request(options, function(error, res, body) {
          if (!error && res.statusCode === 200) {
              resolve(body);
          } else {
              reject(error);
          }
      })
  })
}

Array.prototype.sum = function() {
    return this.reduce(function(a, b) {return a+b});
};
  
const htmlData = async (make, model, year) => {
    const html = await getHtml(make, model, year);
    const $ = cheerio.load(html);
    const ha = $('.heading-3').map((index, element) => {
        var elem = $(element).text().replace('$','').replace(',','')
        if (elem.length < 10) {
            return parseInt(elem)
        }
    }).get()
    try {
        return (ha.sum() / ha.length)
    } catch (err) {
        return err
    }
}


app.get('/estimate/:make/:model/:year', async (req, res) => {
    const estimate = await htmlData(req.params.make, req.params.model, req.params.year)
    res.json({estimate: estimate})
});

const getTrim = (make, model, year) => {
    var options = {
        'method': 'GET',
        'url': `https://www.truecar.com/used-cars-for-sale/listings/${make.toLowerCase()}/${model.toLowerCase()}/year-${year}`,
    };
    return new Promise((resolve, reject) => {
      request(options, function(error, res, body) {
          if (!error && res.statusCode === 200) {
              resolve(body);
          } else {
              reject(error);
          }
      })
  })
}

const htmlDataTrim = async (make, model, year) => {
    const html = await getTrim(make, model, year);
    const $ = cheerio.load(html);
    const js = $('script').text().toLowerCase().split('"trims":["').slice(1)
    const ha = js.map((x) => {
        return x.split('"]')[0].toUpperCase().replace('-', ' ')
    })
    try {
        return ha
    } catch (err) {
        return err
    }
}

app.get('/trim/:make/:model/:year', async (req, res) => {
    const trim = await htmlDataTrim(req.params.make, req.params.model, req.params.year)
    res.json({trim: trim})
});

const getDubizzleHtml = (make, model, year, specs) => {
    var options = {
        'method': 'GET',
        'url': `https://uae.dubizzle.com/motors/used-cars/${make}/${model}/?regional_specs=${specs === 'gcc' ? '824' : '825'}&year__gte=${year}&year__lte=${year}`,
    
    };
    console.log(options)
    return new Promise((resolve, reject) => {
      request(options, function(error, res, body) {
          if (!error && res.statusCode === 200) {
              resolve(body);
          } else {
              reject(error);
          }
      })
  })
}
  
const htmlDubizzleData = async (make, model, year, specs) => {
    const html = await getDubizzleHtml(make.toLowerCase(), model.toLowerCase().replace(' ','-'), year, specs);
    const $ = cheerio.load(html);
    const ha = $('.sc-cmkc2d-7.sc-11jo8dj-4').map((index, element) => {
        var elem = $(element).text().replace(',','')
        if (elem.length < 10) {
            return parseInt(elem)
        }
    }).get()
    try {
        return (ha.sum() / ha.length)
    } catch (err) {
        return err
    }
}

app.get('/dbzestimate/:make/:model/:year/:specs', async (req, res) => {
    const estimate = await htmlDubizzleData(req.params.make, req.params.model, req.params.year, req.params.specs)
    res.json({estimate: estimate})
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