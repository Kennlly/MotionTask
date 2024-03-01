import LOGGER from "../../config/winstonConfig.js";
import schedule from "node-schedule";
import fetchMeData from "./fetchMeData.js";
import moment from "moment";

export default async function scheduledJob(token) {
   let isReachingLimit = false;
   let lastReachingLimitTime;

   schedule.scheduleJob("*/2 * * * * *", async () => {
      if (isReachingLimit) {
         // Establish a timestamp for continuous comparison
         lastReachingLimitTime = lastReachingLimitTime ? lastReachingLimitTime : moment();
         const now = moment();
         const diff = now.diff(lastReachingLimitTime, "second");

         // Wait half-hour then reset the flag
         if (diff >= 30 * 60) {
            isReachingLimit = false;
            lastReachingLimitTime = null;
         }

         LOGGER.warn("API Limitation Reached, Please wait...");
         return;
      }

      const response = await fetchMeData(token);

      if (JSON.stringify(response) === "{}") return;

      const { usage, data } = response;
      let usageObj;
      try {
         usageObj = JSON.parse(usage);
      } catch (err) {
         LOGGER.error("scheduledJob Func Parsing JSON ERROR!");
         return;
      }

      if (data) LOGGER.info(`My Info: ${JSON.stringify(data)}`);

      isReachingLimit = usageObj["call_count"] >= 99;
   });
}
