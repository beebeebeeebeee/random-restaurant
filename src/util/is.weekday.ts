export function isWeekday(){
    const day = new Date().getDay()
    return day > 0 && day < 6
}