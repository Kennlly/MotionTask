import * as Dotenv from "dotenv";
import * as path from "path";
import appRoot from "app-root-path";
import crypto from "crypto";

const root = `${appRoot["path"]}${path["sep"]}`;

Dotenv.config({ path: `${root}.env` });

export const LOG_FOLDER = `${root}logs${path["sep"]}`;
export const INFO_FOLDER = `${root}info${path["sep"]}`;
export const BASE_URL = process["env"]["BASE_URL"];
export const ENCRYPT_KEY = process["env"]["ENCRYPT_KEY"];

const decrypt = (iv, content) => {
   const decipher = crypto.createDecipheriv("aes-256-ctr", ENCRYPT_KEY, Buffer.from(iv, "hex"));
   const decrypted = Buffer.concat([decipher.update(Buffer.from(content, "hex")), decipher.final()]);
   return decrypted.toString();
};

export const USER_ACCESS_TOKEN = decrypt(process["env"]["USER_ACCESS_TOKEN_IV"], process["env"]["USER_ACCESS_TOKEN_CONTENT"]);
export const APP_ACCESS_TOKEN = decrypt(process["env"]["APP_ACCESS_TOKEN_IV"], process["env"]["APP_ACCESS_TOKEN_CONTENT"]);
export const CLIENT_ID = decrypt(process["env"]["CLIENT_ID_IV"], process["env"]["CLIENT_ID_CONTENT"]);
export const CLIENT_SECRET = decrypt(process["env"]["CLIENT_SECRET_IV"], process["env"]["CLIENT_SECRET_CONTENT"]);
