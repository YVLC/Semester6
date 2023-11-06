const mongoose = require("mongoose");
require("dotenv").config()

const dbConnection = mongoose.connect("mongodb://127.0.0.1:27017/your-database", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

module.exports = {dbConnection}