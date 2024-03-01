import LOGGER from "../config/winstonConfig.js";
import axiosConfig from "../config/axiosConfig.js";
import { BASE_URL, INFO_FOLDER } from "./constant.js";
import { setTimeout } from "timers/promises";
import { readFile, writeFile } from "./fileManagement.js";

export default async function consumeAPIPattern(method, url, headers, params, queryBody) {
   const funcName = "[consumeAPIPattern Func]";
   const funcArgus = `[Method = ${method}; URL = ${url}; Headers = ${JSON.stringify(headers)} Params = ${JSON.stringify(
      params
   )}; Query body = ${JSON.stringify(queryBody)}]`;

   const request = {
      method,
      baseURL: BASE_URL,
      headers,
      url
   };

   if (method === "GET" && params) request.params = params;

   if (method === "POST") request.data = queryBody;

   let retryCounter = 1;

   while (true) {
      try {
         return await axiosConfig(request);
      } catch (err) {
         const { responseCode, statusText, description } = err;

         // The error is string
         if (!responseCode) {
            LOGGER.error(`${funcName} ${funcArgus} - ${err}`);
            return {};
         }

         // The error is customized object
         let fullErrMsg = `Response Code = ${responseCode}; Status Text = ${statusText}`;
         if (description) fullErrMsg += `; Description = ${description}`;

         LOGGER.error(`${funcName} - ${fullErrMsg}. Retrying on ${retryCounter} / 3.`);

         switch (responseCode) {
            case 400:
               // No need to retry
               return {};
            case 401:
               try {
                  const localTokenInfo = await readFile(`${INFO_FOLDER}token`, "json");
                  localTokenInfo.is_valid = false;
                  await writeFile(`${INFO_FOLDER}token`, "json", localTokenInfo);
               } catch (err) {
                  LOGGER.warn(`${funcName} Updating Token Info ERROR - ${err}.`);
               }
               break;
            case 403:
               return JSON.stringify({ usage: { call_count: 100 } });
            default:
               break;
         }

         if (retryCounter === 3) break;

         await setTimeout(1000);
         retryCounter++;
      }
   }

   LOGGER.error(`${funcName} ${funcArgus} - ERROR After 3 Times Retries!`);
   return {};
}
