import axios from "axios";

const teamsUrl = process.env.TEAMS_URL

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