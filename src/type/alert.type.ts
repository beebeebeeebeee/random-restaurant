export interface AlertType {
   id: number
   boardId: number
   dailyPeopleSize: number
   numberOfRandom: number
   notifyTime?: string
   scheduleTime?: string
   scheduleEnableWeekdayOnly: boolean
   scheduleEnableNotHoliday: boolean
}