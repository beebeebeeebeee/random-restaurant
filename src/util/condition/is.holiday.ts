import axios from 'axios'
import {GovHolidayApiType} from "../../type";

const apiUrl = "https://www.1823.gov.hk/common/ical/tc.json"

const getDate = (d: Date): number => parseInt(`${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, '0')}${d.getDate().toString().padStart(2, '0')}`)

export async function isHoliday(date: Date = new Date()): Promise<boolean> {
    const target = getDate(date)
    const result = (await axios.get<GovHolidayApiType>(apiUrl)).data.vcalendar[0].vevent
    return result.find(e => parseInt(e.dtstart[0]) <= target && parseInt(e.dtend[0]) >= target) != null
}