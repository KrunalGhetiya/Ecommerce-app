const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const filename = uuidv4()+ '.jpg';
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());

app.use(
  multer({ storage: fileStorage, fileFilter:fileFilter}).single("image")
);

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth",authRoutes);

// Custom Error Handling Middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data:data});
});

mongoose
  .connect(
    "mongodb+srv://krunalghetiya23:YkOapfvFpMsveOu0@cluster0.59cron4.mongodb.net/Social_Media"
  )
  .then((result) => {
    const server = app.listen(5000);
    const io = require('./socket').init(server);
    io.on('connection', socket=>{
      console.log('cilent connected');
    })
  })
  .catch((err) => {
    console.log(err);
  });
