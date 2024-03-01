import scheduledJob from "./controller/me/scheduledJob.js";
import { validateInputToken } from "./utils/tokenController.js";
import LOGGER from "./config/winstonConfig.js";
import { INFO_FOLDER, USER_ACCESS_TOKEN } from "./utils/constant.js";
import { writeFile } from "./utils/fileManagement.js";

const main = async () => {
   const inputToken = process.argv[2];

   const isValid = await validateInputToken(inputToken);
   if (!isValid) {
      LOGGER.error("Input Token Is Invalid!");

      const content = {
         is_valid: false,
         access_token: USER_ACCESS_TOKEN
      };

      try {
         await writeFile(`${INFO_FOLDER}token`, "json", content);
      } catch (err) {
         LOGGER.error(`Main Func Writing JSON File ERROR - ${err}.`);
         LOGGER.error("Application Stopped!");
         process.exit();
      }
   }

   await scheduledJob();
};
// console.log("global - ", global.__basedir);
await main();
