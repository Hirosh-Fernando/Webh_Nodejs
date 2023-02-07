const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    //setting up the email service
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    //setting up the email
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.text,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }  else {
            console.log('email sent successfully!' + info.response)
        }
    });
};

module.exports = sendEmail;