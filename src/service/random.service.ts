import {RestaurantType} from "../type";
import {getRestaurantList} from "../database";
import * as seedrandom from "seedrandom";

export async function getRandomRestaurant(boardId: string, seed: string, isWeighted: boolean = true, times: number = 1): Promise<[RestaurantType[], number[]]> {
    const restaurantList = await getRestaurantList(boardId)
    if (restaurantList.length == 0) return [[], [0]]

    // construct random method with seed
    const random = seedrandom(seed)

    // assign random method by isWeighted flag
    let randomMethod: (randomNumber: number) => number
    if (isWeighted) {
        const total = restaurantList.reduce((p, c) => p + c.weight, 0)
        const cdf = restaurantList.map(e => e.weight).map((sum => value => sum += value / total)(0))
        randomMethod = (randomNumber: number) => cdf.filter(el => randomNumber >= el).length
    } else {
        randomMethod = (randomNumber: number) => Math.floor(randomNumber * restaurantList.length)
    }

    if (times >= restaurantList.length) return [restaurantList, Array.from({length: restaurantList.length}).map((e_, i) => i)]

    const indexes = Array.from<number>({length: times}).reduce((previousValue: number[]) => {
        while (true) {
            const randomResult = randomMethod(random())
            if (!previousValue.includes(randomResult)) {
                return [...previousValue, randomResult]
            }
        }
    }, [])

    return [restaurantList, indexes]
}