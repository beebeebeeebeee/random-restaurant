import {verbose} from "sqlite3";
import {RestaurantModal} from "../modal/restaurant.modal";

const sqlite3 = verbose()

const database = new sqlite3.Database('./database.db');

database.run(`CREATE TABLE IF NOT EXISTS FOOD_DB (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant TEXT NOT NULL,
    weight INTEGER NOT NULL
)`)

export async function getRestaurantList(): Promise<RestaurantModal[]> {
    return await new Promise((resolve, reject) => {
        const result: any[] = []
        database.each('SELECT * FROM FOOD_DB', (error, row) => {
            if (error != null) return reject(result)
            result.push(row)
        }, (error, count) => {
            if (error != null) return reject(result)
            resolve(result)
        })
    })
}

export async function createRestaurant(payload: RestaurantModal): Promise<boolean> {
    return await new Promise((resolve, reject) => {
        database.run("INSERT INTO FOOD_DB (restaurant, weight) VALUES (?, ?)",
            [payload.restaurant, payload.weight],
            (error) => {
                if (error != null) return reject(error)
                resolve(true)
            }
        )
    })
}

export async function updateRestaurant(id: string, payload: RestaurantModal): Promise<boolean> {
    return await new Promise((resolve, reject) => {
        database.run("UPDATE FOOD_DB SET restaurant = ?, weight = ? WHERE id = ?",
            [payload.restaurant, payload.weight, id],
            (error) => {
                if (error != null) return reject(error)
                resolve(true)
            }
        )
    })
}

export async function deleteRestaurant(id: string): Promise<boolean> {
    return await new Promise((resolve, reject) => {
        database.run("DELETE FROM FOOD_DB WHERE id = ?",
            [id],
            (error) => {
                if (error != null) return reject(error)
                resolve(true)
            }
        )
    })
}

export {database}
