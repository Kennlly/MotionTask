import consumeAPIPattern from "../../utils/consumeAPIPattern.js";
import { getValidToken } from "../../utils/tokenController.js";

export default async function fetchMeData() {
   const token = await getValidToken();
   if (!token) return {};

   const url = "/v19.0/me";
   const params = {
      fields: "id,name,last_name"
   };
   const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
   };

   return consumeAPIPattern("GET", url, headers, params, null);
}
