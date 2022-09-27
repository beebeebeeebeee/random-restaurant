import {RestaurantType} from "../type";
import {getRestaurantList} from "../database";
import * as seedrandom from "seedrandom";

/**
 * Get Random Restaurant by params
 * @param boardId
 * @param seed
 * @param isWeighted
 * @param times
 * @param people
 */
export async function getRandomRestaurant(boardId: string, seed: string, isWeighted: boolean = true, times: number = 1, people = 0): Promise<[RestaurantType[], number[]]> {
    const originalRestaurantList = (await getRestaurantList(boardId))
    const filteredRestaurantList = originalRestaurantList.filter(el => el.peopleLimit === -1 || el.peopleLimit >= people)
    if (filteredRestaurantList.length == 0) return [filteredRestaurantList, []]

    // construct random method with seed
    const random = seedrandom(seed)

    // assign random method by isWeighted flag
    let randomMethod: (randomNumber: number) => number
    if (isWeighted) {
        const total = filteredRestaurantList.reduce((p, c) => p + c.weight, 0)
        const cdf = filteredRestaurantList.map(e => e.weight).map((sum => value => sum += value / total)(0))
        randomMethod = (randomNumber: number) => cdf.filter(el => randomNumber >= el).length
    } else {
        randomMethod = (randomNumber: number) => Math.floor(randomNumber * filteredRestaurantList.length)
    }

    if (times >= filteredRestaurantList.length) return [filteredRestaurantList, Array.from({length: filteredRestaurantList.length}).map((e_, i) => i)]

    const indexes = Array.from<number>({length: times}).reduce((previousValue: number[]) => {
        while (true) {
            const randomResult = randomMethod(random())
            if (!previousValue.includes(randomResult)) {
                return [...previousValue, randomResult]
            }
        }
    }, [])

    return [filteredRestaurantList, indexes]
}