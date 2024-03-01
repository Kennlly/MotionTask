import axios from "axios";

const buildInstance = () => {
   const instance = axios.create({
      timeout: 10000
   });

   // Intercepting to capture errors
   instance.interceptors.response.use(
      (response) => {
         const { headers, data } = response;

         return {
            usage: headers["x-app-usage"],
            data
         };
      },

      (error) => {
         const errResponse = error["response"];

         if (!errResponse) return Promise.reject(error.toString());

         const {
            data: {
               error: { message, code }
            },
            status,
            statusText
         } = errResponse;

         return Promise.reject({
            responseCode: status,
            statusText,
            description: `${message}; Throttle Error Codes = ${code}`
         });
      }
   );

   return instance;
};

const axiosConfig = buildInstance();
export default axiosConfig;
