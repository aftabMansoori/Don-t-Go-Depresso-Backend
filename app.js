require("dotenv").config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const helmet = require("helmet");
const passport = require("passport");
// const session = require('express-session')

//Passport Config
require("./config/passport");

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Mongoose Connection
mongoose
  .connect(process.env.DATABASE || "mongodb://localhost:27017/dontGoDepresso")
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log("databaseError: ", err);
  });

//Express Session
// app.use(
//     session({
//         secret: process.env.SECRET || 'secret',
//         resave: true,
//         saveUninitialized: true
//     })
// )

//passport middleware
app.use(passport.initialize());
// app.use(passport.session())
//Routers
const collegeRouter = require("./routes/college");
const studentRouter = require("./routes/student");
const { errorHandling } = require("./Utils/ErrorHandling");

app.get("/", (req, res) => {
  res.status(200).json({ status: "Site is live : Ok" });
});

app.use("/college", collegeRouter);
app.use("/student", studentRouter);
errorHandling(app);

app.listen(PORT, () => {
  console.log(`Server is live at ${PORT}`);
});
