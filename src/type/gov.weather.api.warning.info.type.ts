export interface GovWeatherApiWarningInfoType {
    details: Array<{
        contents: Array<string>
        warningStatementCode: string
        updateTime: Date
    }>
}
