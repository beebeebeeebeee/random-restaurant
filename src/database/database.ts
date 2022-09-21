import {verbose} from "sqlite3";
import {RestaurantModal} from "../modal/restaurant.modal";

const sqlite3 = verbose()

const database = new sqlite3.Database('./database/database.db');

database.run(`
    CREATE TABLE IF NOT EXISTS RESTAURANT_DB (
        id              INTEGER     PRIMARY KEY     AUTOINCREMENT,
        board_id        INTEGER                     NOT NULL,
        restaurant      TEXT                        NOT NULL,
        weight          INTEGER                     NOT NULL,
        people_limit    INTEGER     DEFAULT -1      NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_restaurant_db ON RESTAURANT_DB (
        board_id
    );
`)

export async function getRestaurantList(boardId: string): Promise<RestaurantModal[]> {
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
    return result.map(e=> {
        const payload : RestaurantModal = {
            id: e.id,
            boardId: e.board_id,
            restaurant: e.restaurant,
            weight: e.weight,
            peopleLimit: e.people_limit
        }
        return payload
    })
}

export async function createRestaurant(payload: RestaurantModal): Promise<boolean> {
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

export async function updateRestaurant(id: string, payload: RestaurantModal): Promise<boolean> {
    return await new Promise((resolve, reject) => {
        database.run("UPDATE RESTAURANT_DB SET restaurant = ?, weight = ?, people_limit = ? WHERE id = ?",
            [payload.restaurant, payload.weight, payload.peopleLimit, id],
            (error) => {
                if (error != null) return reject(error)
                setTimeout(()=>{
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

export {database}
