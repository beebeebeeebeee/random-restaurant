import axios from 'axios'
import {CurrentWeatherType, GovWeatherApiRhrreadType} from "../type";
import {GovWeatherApiWarningInfoType} from "../type/gov.weather.api.warning.info.type";
import {WeatherIconConstant} from "../constant";

const apiUrl = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php"

export async function getCurrentWeather(region: string, district: string): Promise<CurrentWeatherType> {
    const rhrreadData: GovWeatherApiRhrreadType = (await axios.get(`${apiUrl}?dataType=rhrread&lang=en`)).data
    const isLightning = rhrreadData.lightning.data.find(e => e.place === region)?.occur === 'true'
    const rainfall = rhrreadData.rainfall.data.find(e => e.place === district)
    const avgRainfall = (rainfall.min || 0 + rainfall.max || 0) / 2
    const icon = rhrreadData.icon.map(e=>WeatherIconConstant[e]).join('')

    const warningInfoData: GovWeatherApiWarningInfoType = (await axios.get(`${apiUrl}?dataType=warningInfo&lang=en`)).data
    const warning = warningInfoData.details.map(e => e.contents[0])

    return {isLightning, avgRainfall, icon, warning}
}
