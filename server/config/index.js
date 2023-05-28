const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

module.exports = {
    NODE_ENV,
    PORT,
    DB_URI,
    DB_NAME,
    JWT_SECRET,
    JWT_EXPIRES_IN,
} = process.env;
