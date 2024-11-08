const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cookieParser = require("cookie-parser");

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});
const logger = require("./services/logger_sevice");
logger.log("info", "logger");

const PORT = config.get("port") || 3000;

const mainRoute = require("./routes/index.routes");
const error_handling_middleware = require("./middleware/error_handling_middleware");


const viewRouter = require("./routes/view.routes");

const app = express();

app.use(express.json());

app.use(cookieParser());


app.use(express.static("views"));

app.use(expressWinstonDBLogger);


app.use("/api", mainRoute); //backend



app.use(error_handling_middleware); // error handling eng oxirida bo'lishi lozim
async function start() {
  try {
    await mongoose.connect(config.get("dbUri"));
    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
