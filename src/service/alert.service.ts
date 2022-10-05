import {AlertType} from "../type";
import {createAlert, getAlert} from "../database";

export async function getAlertById(id: string): Promise<AlertType> {
    const result = await getAlert(id)
    if (result.length == 1) return result[0]

    const payload: AlertType = {
        id: id as any,
        boardId: 1,
        dailyPeopleSize: 0,
        numberOfRandom: 1,
        notifyTime: null,
        scheduleTime: null,
        lat: null,
        long: null,
        region: null,
        district: null,
        scheduleEnableNotHoliday: false,
        scheduleEnableWeekdayOnly: false

    }
    await createAlert(payload)
    return await getAlertById(id)
}