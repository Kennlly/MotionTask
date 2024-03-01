import { promises as fs } from "fs";
import LOGGER from "../config/winstonConfig.js";

export const writeFile = async (filePath, category, content) => {
   const funcName = "[writeFile Func]";
   const funcArgus = `[File Path = ${filePath}; Category = ${category}; Content = ${JSON.stringify(content, null, 3)}]`;

   const fullFilePath = `${filePath}.${category}`;

   // Handle writing txt or json file
   if (category !== "json" && category !== "txt") {
      throw new Error(`${funcName} - File Category ERROR! Category = ${category}`);
   }

   try {
      const fileContent = category === "json" ? JSON.stringify(content, null, 3) : content;

      await fs.writeFile(fullFilePath, fileContent);

      LOGGER.info(`${funcName} - Writing "${fullFilePath}" Succeed!`);
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err}\n${funcArgus}`);
   }
};

export const isFileExist = async (filePath) => {
   try {
      await fs.access(filePath);
      return true;
   } catch {
      LOGGER.warn(`[isFileExist Func] - "${filePath}" is NOT Exist.`);
      return false;
   }
};

export const readFile = async (filePath, category) => {
   const funcName = "[readFile Func]";
   const funcArgus = `[File Path = ${filePath}; Category = ${category}]`;

   //handle reading txt or json file
   if (category !== "json" && category !== "txt") {
      throw new Error(`${funcName} - File Category ERROR! Category = ${category}`);
   }

   const fullFilePath = `${filePath}.${category}`;

   const isTargetFileExist = await isFileExist(fullFilePath);

   try {
      // File does NOT Exist
      if (!isTargetFileExist) {
         if (category === "json") {
            await writeFile(filePath, "json", {});
            return {};
         }

         await writeFile(filePath, "txt", "");
         return "";
      }

      // File Exists
      const data = await fs.readFile(fullFilePath, "utf-8");

      return category === "txt" ? data : JSON.parse(data);
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err}. ${funcArgus}`);
   }
};
