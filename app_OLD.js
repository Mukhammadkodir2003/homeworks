const express = require("express");

const config = require("config");

const mongoose = require("mongoose");
const cookieParser = require('cookie-parser')

const PORT = config.get("port");
const mainRouter = require("./routes/index.routes");
const errorHandlerMiddleware  = require("./error_middleware/errorHandling.middleware");
const loger = require("./services/logger.service");
const winston = require("winston/lib/winston/config");
const expressWinston = require("express-winston")
// require("dotenv").config({
//   path:`.env.${process.env.NODE_ENV}`
// })

// console.log(process.env.NODE_ENV);
// console.log(process.env.secret);
// console.log(config.get("secret"));


const app = express();
app.use(express.json());
app.use(cookieParser())

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.json()
  ),
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));

app.use("/api", mainRouter);

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
}));






loger.log("info","log ma'lumotlar");
loger.error(" error log ma'lumotlar");
loger.debug("debug log ma'lumotlar");
loger.warn("warn log ma'lumotlar");
loger.info("info log ma'lumotlar");
// loger.trace("trace log ma'lumotlar");
// loger.table([1, 2, 3]);
// loger.table([
//   ["komron", 22],
//   ["Alisher", 22],
// ]);



app.use(errorHandlerMiddleware) //errorni ushlab olish uchun oxirida chaqiriladi

async function start() {
  try {
    await mongoose.connect(config.get("dbAtlasUri"));
    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Malumotlar bazasiga ulanishda hatolik");
  }
}

start();
