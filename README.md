1. Environment Setup and Start<br>
    * Cloning the repository
    * In terminal, input "`npm install`" to install the modules
    * After the modules are ready, input "`node index.js {ACCESS TOKEN}`" to start the application<br>
      ${ACCESS TOKEN} is optional
2. One-time Input Token Validation<br>
   The application's token validation function has been thoroughly tested using a predefined token. In the event that your token
   fails validation, the application will seamlessly switch to using the predefined token to ensure uninterrupted functionality.
   <br>
3. Token Extension<br>
   Prior to each API call, the application meticulously verifies the token's validity. Should the token be deemed invalid, it
   undergoes a refreshing process by "exchanging" it with a new one, under the assumption that token expiration is the sole
   cause of invalidity.<br>
   To facilitate this functionality, the application securely stores token information in a local file. In a production
   environment, where data security is of paramount importance, sensitive information like tokens should be stored
   in a database with hashed values or utilizing cloud technologies such as "Azure Key Vault."<br>
4. API Limitation<br>
   To address API usage limitations, the application employs a flag system within the scheduled job. When the "call_count"
   exceeds 99(percent), indicating that the API calls are nearing the limit, the flag is set to true. In this state, the
   scheduled job abstains from making additional API calls. Furthermore, the application checks the current time against the
   timestamp when the flag was activated. After a half-hour interval, the flag reverts to false, enabling the job to resume API
   calls.<br>
   The "call_count" can be obtained from the API response header or set to 100 upon encountering a 403 error code.<br>
   Opting to suspend API calls for half an hour, rather than one hour as outlined, strikes a balance between maintaining data
   flow and adhering to API limitations. This approach ensures uninterrupted functionality while adhering to API constraints.
5. Encrypted .env file<br>
   The application highlights the importance of encryption by showcasing the necessity for safeguarding sensitive data. In a
   real production environment, it's imperative that the "Key," "IV," and "CONTENT" are not stored in a single location. 
    