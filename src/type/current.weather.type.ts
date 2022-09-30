import {WRAIN, WTCSGNL} from "./gov.weather.api.warnsum.type";

export interface CurrentWeatherType {
    isLightning: boolean
    avgRainfall: number
    icon: string
    warning: string[]
    warnRain?: WRAIN
    warnTp?: WTCSGNL
}