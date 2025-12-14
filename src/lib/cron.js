// File: src/lib/cron.js

import cron from "cron";
import https from "https";

// This expression: "*/14 * * * *" 
// means "run every 14 minutes" (0, 14, 28, 42, 56, and so on).
const job = new cron.CronJob("*/14 * * * *", function () {
    // ... rest of your function (the ping logic)
    if (!process.env.API_URL) {
        console.error("CRON JOB FAILED: API_URL is not defined in environment variables.");
        return;
    }

    console.log("Sending GET request to keep service alive...");
    
    https
        .get(process.env.API_URL, (res) => {
            if (res.statusCode === 200) {
                console.log(`[${new Date().toLocaleTimeString()}] GET request sent successfully (Status: 200)`);
            } else {
                console.log(`[${new Date().toLocaleTimeString()}] Get request failed (Status: ${res.statusCode})`);
            }
        })
        .on("error", (e) => console.error(`[${new Date().toLocaleTimeString()}] Error while sending request:`, e.message));
});

export default job;