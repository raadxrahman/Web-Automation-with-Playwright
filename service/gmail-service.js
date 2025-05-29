import {config} from "dotenv";
import {request, test} from "@playwright/test";

config();

let gmail = async (request) => { // Function to get the latest Gmail message snippet
    let gmailList = await request.get("https://gmail.googleapis.com/gmail/v1/users/me/messages", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + process.env.access_token
        }
    });

    let messageId = (await gmailList.json()).messages[0].id; // Get the ID of the latest email message

    let lastGmail = await request.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + process.env.access_token
        }
    });
    return (await lastGmail.json()).snippet; // This returns the snippet of the latest email

};

export default {gmail}