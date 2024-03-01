import { format, createLogger, transports } from "winston";
import dailyRotateFile from "winston-daily-rotate-file";
import { LOG_FOLDER } from "../utils/constant.js";

const customizeLog = () => {
   const { timestamp, combine, printf } = format;

   const logFormat = printf(({ level, message, timestamp, stack }) => {
      return `[${timestamp}][${level}]: ${stack || message}`;
   });

   const transport = new dailyRotateFile({
      dirname: LOG_FOLDER,
      filename: "%DATE%.log",
      datePattern: "YYYY-MM-DD"
   });

   return createLogger({
      level: "debug",
      format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }), format.errors({ stack: true }), logFormat),
      transports: [
         transport,
         new transports.Console({
            format: combine(
               format.colorize({
                  colors: {
                     warn: "magenta",
                     error: "bold red cyanBG"
                  }
               }),
               timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
               format.errors({ stack: true }),
               logFormat
            )
         })
      ]
   });
};

const LOGGER = customizeLog();
export default LOGGER;
