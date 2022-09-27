const fetch = require('node-fetch');

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

module.exports = {userNotification}