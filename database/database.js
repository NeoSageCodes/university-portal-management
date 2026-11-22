const mongoose = require("mongoose");
const URI = process.env.MONGODB_URI;

mongoose
  .connect(URI)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.log("Failed to connect to DB: ", error.message);
  });