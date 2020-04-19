require('dotenv').config();
const sgmail = require('@sendgrid/mail');

const sgapikey = process.env.APIKEY;

sgmail.setApiKey(sgapikey);

const regmessage = (email) => {

    sgmail.send({

        to:email,
        from:'team@incer.com.com',
        subject:'Welcome',
        Text:`Welcome to incer hope you like the site .Please donot reply to this mail `
    });


};

const alertgmessage = (email,device) => {

    sgmail.send({

        to:email,
        from:'team@incer.com.com',
        subject:'New Login',
        Text:`You just logged in from another , ${device} device .
                  Please be aware of this . 

          ---------------------------------------------------

                  Please donot reply to this mail`
    });


};


module.exports = { 
    regmessage,alertgmessage
}


