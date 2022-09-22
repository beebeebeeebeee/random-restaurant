export interface GovHolidayApiType {
    "vcalendar": [GovHolidayApiVcalendarType]
}

interface GovHolidayApiVcalendarType {
    "prodid": string
    "version": string
    "calscale": string
    "x-wr-timezone": string
    "x-wr-calname": string
    "x-wr-caldesc": string
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