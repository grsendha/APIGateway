const dotenv = require("dotenv");
const path = require("path");

// Specify the path to the .env file
const envPath = path.resolve(__dirname, "../../.env");

// Load the .env file using the specified path
dotenv.config({ path: envPath });

module.exports = {
  PORT: process.env.PORT,
};
