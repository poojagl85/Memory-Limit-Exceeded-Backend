const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = require('../config');

exports.sendMail = async (sender, msg) => {
      try {
            const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
            oAuth2Client.setCredentials({
                  refresh_token: REFRESH_TOKEN
            })
            const accessToken = await oAuth2Client.getAccessToken();
            const transport = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                        type: 'OAuth2',
                        user: 'poojagl85@gmail.com',
                        clientId: CLIENT_ID,
                        clientSecret: CLIENT_SECRET,
                        refreshToken: REFRESH_TOKEN,
                        accessToken: accessToken
                  }
            })

            const mailOptions = {
                  from: 'poojagl85@gmail.com',
                  to: sender,
                  subject: 'Memory Limit Exceeded...',
                  text: msg,
                  html: msg
            }

            const result = await transport.sendMail(mailOptions);
            return result
      } catch (error) {
            console.log("In error");
            console.log(error);
            return new Error('Unable to send email...!');
      }
}

// sendMail().then((result) => console.log('email sent...!')).catch(err => console.log(err))


