import axios from 'axios'
import {CurrentWeatherType, GovWeatherApiType} from "../type";

const apiUrl = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php"

export async function getCurrentWeather(region: string, district: string): Promise<CurrentWeatherType> {
    const data: GovWeatherApiType = (await axios.get(`${apiUrl}?dataType=rhrread&lang=en`)).data
    console.log(data)
    const isLightning = data.lightning.data.find(e => e.place === region).occur === 'true'
    const rainfall = data.rainfall.data.find(e => e.place === district)
    const avgRainfall = (rainfall.min || 0 + rainfall.max || 0) / 2
    return {isLightning, avgRainfall}
}
