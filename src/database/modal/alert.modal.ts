import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity("ALERT_DB")
export class AlertModal {

    @PrimaryColumn({name: 'id'})
    id: number

    @Column({name: 'board_id', nullable: false})
    boardId: number

    @Column({name: 'daily_people_size', nullable: false, default: 0})
    dailyPeopleSize: number

    @Column({name: 'number_of_random', nullable: false, default: 1})
    numberOfRandom: number

    @Column({name: 'notify_time', nullable: true})
    notifyTime?: string

    @Column({name: 'schedule_time', nullable: true})
    scheduleTime?: string

    @Column({name: 'schedule_enable_weekday_only', nullable: false, default: 0})
    scheduleEnableWeekdayOnly: boolean

    @Column({name: 'schedule_enable_not_holiday', nullable: false, default: 0})
    scheduleEnableNotHoliday: boolean
}