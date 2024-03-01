import consumeAPIPattern from "./consumeAPIPattern.js";
import { APP_ACCESS_TOKEN, CLIENT_ID, CLIENT_SECRET, INFO_FOLDER } from "./constant.js";
import { readFile, writeFile } from "./fileManagement.js";
import moment from "moment";
import LOGGER from "../config/winstonConfig.js";

export const validateInputToken = async (token) => {
   if (!token) return false;

   const url = "/debug_token";
   const params = {
      input_token: token,
      access_token: APP_ACCESS_TOKEN
   };

   const response = await consumeAPIPattern("GET", url, null, params, null);
   if (JSON.stringify(response) === "{}") return false;

   const tokenPath = `${INFO_FOLDER}token`;
   const content = response["data"]["data"];
   const expireInSec = content["expires_at"];
   content.expires_at = moment().add(expireInSec, "second").format("YYYY-MM-DD HH:mm");
   content.access_token = token;

   try {
      await writeFile(tokenPath, "json", content);
   } catch (err) {
      LOGGER.warn(`validateInputToken Func Writing JSON File ERROR - ${err}.`);
   }

   return content["is_valid"];
};

const exchangeToken = async (token) => {
   const url = "/oauth/access_token";
   const params = {
      grant_type: "fb_exchange_token",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      fb_exchange_token: token
   };

   const response = await consumeAPIPattern("GET", url, null, params, null);
   if (JSON.stringify(response) === "{}") return {};

   return response["data"];
};

export const getValidToken = async () => {
   try {
      const localTokenInfo = await readFile(`${INFO_FOLDER}token`, "json");

      const { expires_at, is_valid, access_token } = localTokenInfo;

      const now = moment();
      const expiresAtMoment = moment(expires_at, "YYYY-MM-DD HH:mm");
      const diff = expiresAtMoment.diff(now, "minute");

      if (is_valid && diff >= 60) return access_token;

      // Existing token is invalid or expiring within 60 minutes, refresh
      const newToken = await exchangeToken(access_token);
      newToken.expires_at = moment().add(newToken["expires_in"], "second").format("YYYY-MM-DD HH:mm");
      newToken.is_valid = true;
      await writeFile(`${INFO_FOLDER}token`, "json", newToken);

      return newToken["access_token"];
   } catch (err) {
      LOGGER.error(`getValidToken Func Catching ERROR - ${err}.`);
      return "";
   }
};
