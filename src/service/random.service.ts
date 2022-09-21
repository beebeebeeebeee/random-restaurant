import {RestaurantModal} from "../modal/restaurant.modal";
import {getRestaurantList} from "../database";
import * as seedrandom from "seedrandom";

export async function getRandomRestaurant(boardId: string, seed: string, isWeighted: boolean): Promise<[RestaurantModal[], number]> {
    const restaurantList = await getRestaurantList(boardId)
    if (restaurantList.length == 0) return [[], 0]

    let index: number
    if (isWeighted) {
        const total = restaurantList.reduce((p, c) => p + c.weight, 0)
        const cdf = restaurantList.map(e => e.weight).map((sum => value => sum += value / total)(0))
        index = cdf.filter(el => seedrandom(seed)() >= el).length
    } else {
        index = Math.floor(seedrandom(seed)() * restaurantList.length)
    }

    return [restaurantList, index]
}