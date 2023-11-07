require('dotenv').config()

const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

/** send mail from real gmail account */
const sendStatus = (req, res) => {

    const { userEmail } = req.body;
    const { userName } = req.body;
    const { apps } = req.body;

    let config = {
        service : 'gmail',
        auth : {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "salted",
        product : {
            name: process.env.PRODUCT_NAME,
            link : process.env.PRODUCT_LINK
        }
    })

    let response = {
        body: {
            name: userName,
            intro: 'Oops, looks like your application(s) may have been down.',
            table : {
                data : apps
            },
            action: {
                instructions: 'To see the current status of all of your applications, please click here:',
                button: {
                    // color: '#22BC66', // Optional action button color
                    text: 'See my metrics dashboard',
                    link: process.env.DASHBOARD_LINK
                }
            },
        }
    }

    let mail = MailGenerator.generate(response)

    let message = {
        from : process.env.EMAIL,
        to : userEmail,
        subject: "Your application was down",
        html: mail
    }

    transporter.sendMail(message).then(() => {
        return res.status(201).json({
            msg: "you should receive an email"
        })
    }).catch(error => {
        return res.status(500).json({ error })
    })
}


module.exports = {
    sendStatus
}