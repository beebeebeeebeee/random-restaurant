export interface GovWeatherApiRhrreadType {
    lightning: GovWeatherApiLightningType
    rainfall: GovWeatherApiRainFallType
    icon: number[]
    iconUpdateTime: Date
    specialWxTips: string[]
    uvindex: GovWeatherApiUvIndexType
    temperature: GovWeatherApiTemperatureType
    warningMessage: string[]
    mintempFrom00To09: string,
    rainfallFrom00To12: string,
    rainfallLastMonth: string,
    rainfallJanuaryToLastMonth: string,
    tcmessage: string,
    humidity: GovWeatherApiHumidityType
}

export interface GovWeatherApiLightningType {
    data: Array<{
        place: string
        occur: string
    }>
    startTime: Date
    endTime: Date
}

export interface GovWeatherApiRainFallType {
    data: Array<{
        unit: string
        place: string
        max: number
        min: number
        main: string
    }>
    startTime: Date
    endTime: Date
}

export interface GovWeatherApiUvIndexType {
    recordTime: string
    data: Array<{
        value: number
        place: string
        desc: string
    }>
}

export interface GovWeatherApiTemperatureType {
    recordTime: Date
    data: Array<{
        unit: string
        value: number
        place: string
    }>
}

export interface GovWeatherApiHumidityType {
    recordTime: Date
    data: Array<{
        unit: string
        value: number
        place: string
    }>
}