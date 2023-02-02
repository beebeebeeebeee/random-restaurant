import axios from "axios";
import {Config} from "../config";

const {slackUrl} = Config

export async function sendSlackMessage(title: string, subTitle: Array<string>, imageUrl: string | null, pageUrl: string, text?: Array<string>) {
    if (slackUrl == null) return
    const data = {
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": title
                }
            },
            ...subTitle.length > 0 ? [{
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": subTitle.join('')
                }
            }] : [],
            ...imageUrl ? [{
                "type": "image",
                "title": {
                    "type": "plain_text",
                    "text": "Anya's selfie",
                    "emoji": true
                },
                "image_url": imageUrl,
                "alt_text": "image1"
            }] : [],
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Website",
                            "emoji": true
                        },
                        "value": "website",
                        "url": pageUrl,
                        "action_id": "actionId-0"
                    }
                ]
            },
            ...text === undefined ? [] : text.map(each => ({
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": each
                }
            })),
        ]
    }
    try {
        const result = await axios.post(slackUrl, data)

    } catch (e) {
        console.error(e)
    }
}