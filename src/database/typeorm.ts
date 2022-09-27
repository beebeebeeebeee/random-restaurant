import {DataSource} from "typeorm";
import {AlertModal, RestaurantModal} from "./modal";
import {AlertType, RestaurantType} from "../type";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "data/database.db",
    synchronize: true,
    logging: true,
    entities: [
        RestaurantModal,
        AlertModal
    ]
})

void AppDataSource.initialize()

const restaurantModalRepository = AppDataSource.getRepository(RestaurantModal)
const alertModalRepository = AppDataSource.getRepository(AlertModal)


export async function getRestaurantList(boardId: string): Promise<RestaurantType[]> {
    if (!Number(boardId)) return []
    return await restaurantModalRepository.find({
        where: {
            boardId: Number(boardId)
        }
    })
}

export async function createRestaurant(payload: RestaurantType): Promise<boolean> {
    return await restaurantModalRepository.save(payload) != null
}

export async function updateRestaurant(id: string, payload: RestaurantType): Promise<boolean> {
    if (!Number(id)) return false
    return await restaurantModalRepository.update({
        id: Number(id)
    }, payload) != null
}

export async function deleteRestaurant(id: string): Promise<boolean> {
    if (!Number(id)) return false
    return await restaurantModalRepository.delete(Number(id)) != null
}

export async function getAlert(id?: string): Promise<AlertType[]> {
    if (!Number(id)) return []
    return await alertModalRepository.find({
        where: {
            id: Number(id)
        }
    })
}

export async function createAlert(payload: AlertType): Promise<boolean> {
    return await alertModalRepository.save(payload) != null
}

export async function updateAlert(id: string, payload: AlertType): Promise<boolean> {
    if (!Number(id)) return false
    return await alertModalRepository.update({
        id: Number(id)
    }, payload) != null
}