const fetch = require('node-fetch');
const UserModel = require('../models/Users');

const userNotification = (title, text, id) => {
    var notification = {
        title,
        text
    }
    var token = 'AAAA0iOf39A:APA91bEADKj4r1vrSaSPe0mbYs5DVN4QGkyK2xzmN5vuxiIKcsPiabp2Wr3AUr1CUREDkT24afrb8MIzql0V8qr94WjmXH6e37lUnTf4k8Xtog-BwnSMxLt8K4FxnGblvXR818RcV2dA'
    var fcm_token = [id]
    var notification_body = {
        'notification': notification,
        'registration_ids': fcm_token
    }

    fetch('https://fcm.googleapis.com/fcm/send', {
        'method': 'POST',
        'headers': {
            'Authorization': `key=${token}`,
            'Content-Type': 'application/json' 
        },
        'body': JSON.stringify(notification_body)
    }).then(()=>{
        return 200
    }).catch((err)=>{
        console.log(err)
        return 400
    })
}

const userNotificationApi = (req, res, next) => {
    var notification = {
        title: req.body.title,
        text: req.body.text
    }
    var token = 'AAAA0iOf39A:APA91bEADKj4r1vrSaSPe0mbYs5DVN4QGkyK2xzmN5vuxiIKcsPiabp2Wr3AUr1CUREDkT24afrb8MIzql0V8qr94WjmXH6e37lUnTf4k8Xtog-BwnSMxLt8K4FxnGblvXR818RcV2dA'
    var fcm_token = [req.body.id]
    var notification_body = {
        'notification': notification,
        'registration_ids': fcm_token
    }

    fetch('https://fcm.googleapis.com/fcm/send', {
        'method': 'POST',
        'headers': {
            'Authorization': `key=${token}`,
            'Content-Type': 'application/json' 
        },
        'body': JSON.stringify(notification_body)
    }).then(()=>{
        res.status(200).json({ message: 'sent' });
    }).catch((err)=>{
        console.log(err)
        res.status(401).json({ message: err });
    })
};

const usersNotificationApi = async (req, res, next) => {
    const ids = await UserModel.find({Device_Id:{'$exists': 1}})
    const justID = ids.map((data)=>{
        return data.Device_Id
    })

    var notification = {
        title: req.body.title,
        text: req.body.text
    }
    var token = 'AAAA0iOf39A:APA91bEADKj4r1vrSaSPe0mbYs5DVN4QGkyK2xzmN5vuxiIKcsPiabp2Wr3AUr1CUREDkT24afrb8MIzql0V8qr94WjmXH6e37lUnTf4k8Xtog-BwnSMxLt8K4FxnGblvXR818RcV2dA'
    var fcm_token = justID
    var notification_body = {
        'notification': notification,
        'registration_ids': fcm_token
    }

    fetch('https://fcm.googleapis.com/fcm/send', {
        'method': 'POST',
        'headers': {
            'Authorization': `key=${token}`,
            'Content-Type': 'application/json' 
        },
        'body': JSON.stringify(notification_body)
    }).then(()=>{
        res.status(200).json({ message: justID });
    }).catch((err)=>{
        console.log(err)
        res.status(401).json({ message: err });
    })

};

const userNotificationId = async (req, res, next) => {
    const id = await UserModel.findOne({email: req.body.email})
    if (id) {
        res.status(200).json({deviceId: id?.Device_Id || ""})
    } else {
        res.status(401).json({message: "Something went wrong"})
    }
};

module.exports = {userNotification, usersNotificationApi, userNotificationApi, userNotificationId}