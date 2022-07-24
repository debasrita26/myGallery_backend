const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors=require('cors');
const placesRoutes = require("./routes/images-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
require('dotenv').config();

const app = express();

app.use(bodyParser.json({limit:'5mb',type:'application/json'}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  next();
});

// app.use(cors);
app.use("/api/images", placesRoutes);
app.use("/api/users", usersRoutes);

app.use(bodyParser.json({limit:'5mb',type:'application/json'}));

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const port=5010;
app.listen(port, ()=> console.log(`App is running on port ${port}`));

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
