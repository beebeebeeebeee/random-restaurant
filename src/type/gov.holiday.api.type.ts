export interface GovHolidayApiType {
    "vcalendar": [GovHolidayApiVcalendarType]
}

interface GovHolidayApiVcalendarType {
    "prodid": "-//1823 Call Centre, Efficiency Office, HKSAR Government//Hong Kong Public Holidays//EN",
    "version": "2.0",
    "calscale": "GREGORIAN",
    "x-wr-timezone": "Asia/Hong_Kong",
    "x-wr-calname": "香港公眾假期",
    "x-wr-caldesc": "香港公眾假期",
    "vevent": GovHolidayApiVeventType[]
}

interface GovHolidayApiVeventType {
    "dtstart": [
        string,
        {
            "value": string
        }
    ],
    "dtend": [
        string,
        {
            "value": string
        }
    ],
    "transp": string
    "uid": string
    "summary": string
}