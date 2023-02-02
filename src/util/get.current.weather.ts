import axios from 'axios'
import {CurrentWeatherType, GovWeatherApiRhrreadType, GovWeatherApiWarnsumType} from "../type";
import {GovWeatherApiWarningInfoType} from "../type/gov.weather.api.warning.info.type";
import {WeatherIconConstant} from "../constant";

const apiUrl = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php"

export async function getCurrentWeather(region: string, district: string): Promise<CurrentWeatherType> {
    const rhrreadData: GovWeatherApiRhrreadType = (await axios.get(apiUrl, {
        params: {
            dataType: 'rhrread',
            lang: 'en'
        }
    })).data
    const isLightning = rhrreadData.lightning?.data.find(e => e.place === region)?.occur === 'true'
    const rainfall = rhrreadData.rainfall?.data.find(e => e.place === district)
    const avgRainfall = ((rainfall?.min ?? 0) + (rainfall?.max ?? 0)) / 2
    const icon = rhrreadData.icon.map(e => WeatherIconConstant[e]).join('')

    const warningInfoData: GovWeatherApiWarningInfoType = (await axios.get(apiUrl, {
        params: {
            dataType: 'warningInfo',
            lang: 'en'
        }
    })).data
    const warning = warningInfoData.details?.map(e => e.contents[0]) || []

    const warnsumData = (await axios.get(apiUrl, {
        params: {
            dataType: 'warnsum',
            lang: 'en'
        }
    })).data
    const warnRain: GovWeatherApiWarnsumType<'WRAIN'>[keyof GovWeatherApiWarnsumType<'WRAIN'>] | undefined = warnsumData.WRAIN
    const warnTp: GovWeatherApiWarnsumType<'WTCSGNL'>[keyof GovWeatherApiWarnsumType<'WTCSGNL'>] | undefined = warnsumData.WTCSGNL

    return {isLightning, avgRainfall, icon, warning, warnRain: warnRain?.code, warnTp: warnTp?.code}
}
