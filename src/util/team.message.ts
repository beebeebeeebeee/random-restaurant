import axios from "axios";

const teamsUrl = "https://fxabs.webhook.office.com/webhookb2/2aa7f774-01e2-42a7-82c9-6d90520030d4@265236f7-2209-439f-9846-5423e4ae0ded/IncomingWebhook/1f220c99ed6242e9bf934acdb796c0e8/2f27526a-04aa-40b0-9784-316524fe4e76"

export async function sendTeamsMessage(restaurant, imageUrl, pageUrl){
    const data = {
        "type": "message",
        "attachments": [
            {
                "contentType": "application/vnd.microsoft.card.hero",
                "content": {
                    "title": `Today's restaurant: ${restaurant}`,
                    "images": [
                        {
                            "url": imageUrl
                        }
                    ],
                    "buttons": [
                        {
                            "type": "openUrl",
                            "title": "Website",
                            "value": pageUrl
                        }
                    ]
                }
            }
        ]
    }
    const result = await axios.post(teamsUrl,data)
}