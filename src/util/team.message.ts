import axios from "axios";
import {Config} from "../config";

const {teamsUrl} = Config

export async function sendTeamsMessage(title: string, subTitle: Array<string>, imageUrl: string | null, pageUrl: string, text?: Array<string>) {
    if (teamsUrl == null) return
    const data = {
        "type": "message",
        "attachments": [
            {
                "contentType": "application/vnd.microsoft.card.hero",
                "content": {
                    title: `<span style='font-size: 2rem; font-weight: 300'>${title}</span>${subTitle.length > 0 ? '<br/>' + subTitle.map(e => `<span style='font-size: 1.5rem; font-weight: 100'>${e}</span>`).join('') : ''}`,
                    text: text === undefined ? undefined : text.join('<br/>'),
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