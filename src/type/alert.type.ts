export interface AlertType {
    id: number
    boardId: number
    dailyPeopleSize: number
    numberOfRandom: number
    lat?: number
    long?: number
    region?: string
    district?: string
    notifyTime?: string
    scheduleTime?: string
    scheduleEnableWeekdayOnly: boolean
    scheduleEnableNotHoliday: boolean
}