import {WeatherWarningStatementCodeConstant} from "../constant";

export type GovWeatherApiWarnsumType<T extends keyof typeof WeatherWarningStatementCodeConstant = keyof typeof WeatherWarningStatementCodeConstant> = Partial<Record<T, {
    name: string
    code: T extends 'WFIRE' ? WFIRE :
        T extends 'WFROST' ? WFROST :
            T extends 'WHOT' ? WHOT :
                T extends 'WCOLD' ? WCOLD :
                    T extends 'WMSGNL' ? WMSGNL :
                        T extends 'WRAIN' ? WRAIN :
                            T extends 'WFNTSA' ? WFNTSA :
                                T extends 'WL' ? WL :
                                    T extends 'WTCSGNL' ? WTCSGNL :
                                        T extends 'WTMW' ? WTMW :
                                            T extends 'WTS' ? WTS : undefined
    actionCode: ActionType
    issueTime: Date
    expireTime: Date
    updateTime: Date
}>>

export type WFIRE = 'WFIREY' | 'WFIRER'
export type WFROST = 'WFROST'
export type WHOT = 'WHOT'
export type WCOLD = 'WCOLD'
export type WMSGNL = 'WMSGNL'
export type WRAIN = 'WRAINA' | 'WRAINR' | 'WRAINB'
export type WFNTSA = 'WFNTSA'
export type WL = 'WL'
export type WTCSGNL = 'TC1' | 'TC3' | 'TC8NE' | 'TC8SE' | 'TC8NW' | 'TC8SW' | 'TC9' | 'TC10'
export type WTMW = 'WTMW'
export type WTS = 'WTS'

export type ActionType = 'ISSUE' | 'REISSUE (WCOLD, WHOT and WFNTSA)' | 'CANCEL' | 'EXTEND(WTS)' | 'UPDATE (WTS)'