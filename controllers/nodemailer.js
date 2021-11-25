const nodemailer = require('nodemailer');
const { google } = require('googleapis');



exports.sendMail = async (sender, msg) => {
      try {
            const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
            oAuth2Client.setCredentials({
                  refresh_token: process.env.REFRESH_TOKEN
            })
            const accessToken = await oAuth2Client.getAccessToken();
            const transport = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                        type: 'OAuth2',
                        user: 'poojagl85@gmail.com',
                        clientId: process.env.CLIENT_ID,
                        clientSecret: process.env.CLIENT_SECRET,
                        refreshToken: process.env.REFRESH_TOKEN,
                        accessToken: accessToken
                  }
            })

            const mailOptions = {
                  from: 'poojagl85@gmail.com',
                  to: sender,
                  subject: 'Message from Out of Memory?',
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


