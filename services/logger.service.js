const  config  = require("config");
const winston = require("winston");
require('winston-mongodb');

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf , json, prettyPrint , colorize} = format;

const myFormat = printf(({ level, message,  timestamp }) => {
  return `${timestamp}  ${level}: ${message}`;
});


const loger = createLogger({
    format: combine( timestamp(), myFormat ),
    transports:[
        new transports.Console({level:"debug"}),
        new transports.File({filename:"./logs/error.log", level:"error"}),
        new transports.File({filename:"./logs/combine.log", level:"info"}),
        new transports.MongoDB({
          db: config.get("dbAtlasUri")
        })
    ]
})
loger.exitOnError = false;

loger.exceptions.handle(
    new transports.File({ filename: "./logs/combine.log" })
  );
loger.rejections.handle(
new transports.File({ filename: "./logs/combine.log"})
);

module.exports =loger