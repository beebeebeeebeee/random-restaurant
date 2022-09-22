import {verbose} from "sqlite3";
import {AlertType, RestaurantType} from "../type";

const sqlite3 = verbose()

const database = new sqlite3.Database('./data/database.db');

async function initDatabase() {
    const sql = [`CREATE TABLE IF NOT EXISTS RESTAURANT_DB (
        id                              INTEGER     PRIMARY KEY     AUTOINCREMENT,
        board_id                        INTEGER                     NOT NULL,
        restaurant                      TEXT                        NOT NULL,
        weight                          INTEGER                     NOT NULL,
        people_limit                    INTEGER     DEFAULT -1      NOT NULL
    );`, `CREATE INDEX IF NOT EXISTS idx_restaurant_db ON RESTAURANT_DB (
        board_id
    );`, `CREATE TABLE IF NOT EXISTS ALERT_DB (
        id                              INTEGER     PRIMARY KEY     NOT NULL,
        board_id                        INTEGER                     NOT NULL,
        daily_people_size               INTEGER     DEFAULT 0       NOT NULL,          
        number_of_random                INTEGER     DEFAULT 1       NOT NULL,         
        notify_time                     TIME                        NULL,
        schedule_time                   TIME                        NULL,
        schedule_enable_weekday_only    BIT         DEFAULT 0       NOT NULL,
        schedule_enable_not_holiday     BIT         DEFAULT 0       NOT NULL
    );`]

    for (const each of sql) {
        await new Promise((resolve, reject) => {
            database.run(each, (err) => {
                if (err) return reject(err)
                resolve(true)
            })
        })
    }
}

void initDatabase()

export async function getRestaurantList(boardId: string): Promise<RestaurantType[]> {
    const result: any[] = await new Promise((resolve, reject) => {
        const result: any[] = []
        database.each('SELECT * FROM RESTAURANT_DB WHERE board_id = ?',
            [boardId],
            (error, row) => {
                if (error != null) return reject(result)
                result.push(row)
            },
            (error, count) => {
                if (error != null) return reject(result)
                resolve(result)
            })
    })
    return result.map(e => {
        const payload: RestaurantType = {
            id: e.id,
            boardId: e.board_id,
            restaurant: e.restaurant,
            weight: e.weight,
            peopleLimit: e.people_limit
        }
        return payload
    })
}

export async function createRestaurant(payload: RestaurantType): Promise<boolean> {
    return await new Promise((resolve, reject) => {
        database.run("INSERT INTO RESTAURANT_DB (board_id, restaurant, weight, people_limit) VALUES (?, ?, ?, ?)",
            [payload.boardId, payload.restaurant, payload.weight, payload.peopleLimit],
            (error) => {
                if (error != null) return reject(error)
                resolve(true)
            }
        )
    })
}

export async function updateRestaurant(id: string, payload: RestaurantType): Promise<boolean> {
    return await new Promise((resolve, reject) => {
        database.run("UPDATE RESTAURANT_DB SET restaurant = ?, weight = ?, people_limit = ? WHERE id = ?",
            [payload.restaurant, payload.weight, payload.peopleLimit, id],
            (error) => {
                if (error != null) return reject(error)
                setTimeout(() => {
                    resolve(true)
                })
            }
        )
    })
}

export async function deleteRestaurant(id: string): Promise<boolean> {
    return await new Promise((resolve, reject) => {
        database.run("DELETE FROM RESTAURANT_DB WHERE id = ?",
            [id],
            (error) => {
                if (error != null) return reject(error)
                resolve(true)
            }
        )
    })
}

export async function getAlert(id?: string): Promise<AlertType[]> {
    const result: any[] = await new Promise((resolve, reject) => {
        const result: any[] = []
        database.each(`SELECT * FROM ALERT_DB ${id != null ? 'WHERE id = ?' : ''}`,
            [id],
            (error, row) => {
                if (error != null) return reject(result)
                result.push(row)
            },
            (error, count) => {
                if (error != null) return reject(result)
                resolve(result)
            })
    })
    return result.map(e => {
        const payload: AlertType = {
            id: e.id,
            boardId: e.board_id,
            dailyPeopleSize: e.daily_people_size,
            numberOfRandom: e.number_of_random,
            notifyTime: e.notify_time,
            scheduleTime: e.schedule_time,
            scheduleEnableWeekdayOnly: e.schedule_enable_weekday_only === 0 ? false : true,
            scheduleEnableNotHoliday: e.schedule_enable_not_holiday === 0 ? false : true
        }
        return payload
    })
}

export async function createAlert(payload: AlertType): Promise<boolean> {
    return await new Promise((resolve, reject) => {
        database.run("INSERT INTO ALERT_DB (id, board_id, daily_people_size, number_of_random, notify_time, schedule_time, schedule_enable_weekday_only, schedule_enable_not_holiday) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [payload.id, payload.boardId, payload.dailyPeopleSize, payload.numberOfRandom, payload.notifyTime, payload.scheduleTime, payload.scheduleEnableWeekdayOnly, payload.scheduleEnableNotHoliday],
            (error) => {
                if (error != null) return reject(error)
                resolve(true)
            }
        )
    })
}

export async function updateAlert(id: string, payload: AlertType): Promise<boolean> {
    return await new Promise((resolve, reject) => {
        database.run("UPDATE ALERT_DB SET board_id = ?, daily_people_size = ?, number_of_random = ?, notify_time = ?, schedule_time = ?, schedule_enable_weekday_only = ?, schedule_enable_not_holiday = ? WHERE id = ?",
            [payload.boardId, payload.dailyPeopleSize, payload.numberOfRandom, payload.notifyTime, payload.scheduleTime, payload.scheduleEnableWeekdayOnly, payload.scheduleEnableNotHoliday, id],
            (error) => {
                if (error != null) return reject(error)
                setTimeout(() => {
                    resolve(true)
                })
            }
        )
    })
}

export {database}
