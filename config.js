const dotenv = require("dotenv");

dotenv.config();

module.exports = {
      PORT: process.env.PORT,
      MONGO_DB_USER: process.env.MONGO_DB_USER,
      MONGO_DB_PASSWORD: process.env.MONGO_DB_PASSWORD,
      MONGO_DB_DATABASE: process.env.MONGO_DB_DATABASE,
      JWT_SECRET: process.env.JWT_SECRET,
      CLIENT_ID: process.env.CLIENT_ID,
      CLIENT_SECRET: process.env.CLIENT_SECRET,
      REDIRECT_URI: process.env.REDIRECT_URI,
      REFRESH_TOKEN: process.env.REFRESH_TOKEN,
      URL: process.env.URL
};