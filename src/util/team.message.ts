import axios from "axios";

const teamsUrl = process.env.TEAMS_URL

export async function sendTeamsMessage(title: string, imageUrl: string, pageUrl: string, text?: string) {
    const data = {
        "type": "message",
        "attachments": [
            {
                "contentType": "application/vnd.microsoft.card.hero",
                "content": {
                    title,
                    text,
                    "images": imageUrl == null ? [] : [
                        {
                            "url": imageUrl
                        }],
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
    const result = await axios.post(teamsUrl, data)
}