import {DataSource, Equal, IsNull, LessThan, MoreThan, Not} from "typeorm";
import {AlertModel, RestaurantModel} from "./model";
import {AlertType, RestaurantType} from "../type";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "data/database.db",
    synchronize: true,
    logging: true,
    entities: [
        RestaurantModel,
        AlertModel
    ]
})

void AppDataSource.initialize()

const restaurantModelRepository = AppDataSource.getRepository(RestaurantModel)
const alertModelRepository = AppDataSource.getRepository(AlertModel)


export async function getRestaurantList(boardId: string, timestamp: Date): Promise<RestaurantType[]> {
    if (!Number(boardId)) return []
    return (await restaurantModelRepository.find({
        where: [
            {
                boardId: Number(boardId),
                createTimestamp: LessThan(timestamp),
                deleteTimestamp: IsNull()
            },
            {
                boardId: Number(boardId),
                createTimestamp: LessThan(timestamp),
                deleteTimestamp: MoreThan(timestamp)
            }
        ],
        withDeleted: true,
        order: {
            displayId: 'ASC',
            id: 'ASC'
        }
    }))
}

export async function createRestaurant(payload: RestaurantType): Promise<boolean> {
    const newEntry = await restaurantModelRepository.save(payload)
    newEntry.displayId = newEntry.id
    return await restaurantModelRepository.save(newEntry) != null
}

export async function updateRestaurant(id: string, payload: RestaurantType): Promise<boolean> {
    if (!Number(id)) return false
    await restaurantModelRepository.softDelete({
        id: Number(id)
    })
    const raw = await restaurantModelRepository.findOne({
        where: {
            id: Number(id)
        },
        withDeleted: true,
    })
    return await restaurantModelRepository.save({
        displayId: raw.displayId ?? Number(id),
        ...payload
    }) != null
}

export async function deleteRestaurant(id: string): Promise<boolean> {
    if (!Number(id)) return false
    return await restaurantModelRepository.softDelete(Number(id)) != null
}

export async function getAlert(id?: string): Promise<AlertType[]> {
    if (!Number(id)) return await alertModelRepository.find()
    return await alertModelRepository.find({
        where: {
            id: Number(id)
        }
    })
}

export async function createAlert(payload: AlertType): Promise<boolean> {
    return await alertModelRepository.save(payload) != null
}

export async function updateAlert(id: string, payload: AlertType): Promise<boolean> {
    if (!Number(id)) return false
    return await alertModelRepository.update({
        id: Number(id)
    }, payload) != null
}