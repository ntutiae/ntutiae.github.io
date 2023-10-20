export function getDateJSON(date = new Date()) {
    let year = date?.getFullYear();
    let month = date?.getMonth() + 1;
    let monthDate = date?.getDate();

    return { year, month, monthDate }
}

export function getDateFromNumber(year, month, monthDate) {
    if(year === null || month === null || monthDate === null) return null;
    return new Date(year, month-1, monthDate);
}

export function getDateStr(date = new Date(), char = "") {
    let { year, month, monthDate } = getDateJSON( date );

    return `${year}${char}${String(month).padStart(2, "0")}${char}${String(monthDate).padStart(2, "0")}`;
}

export function getDaysInMonth(year, month) {
    month -= 1;

    let result = [];
    let num = 1;
    while(new Date(year, month, num).getMonth() === new Date(year, month).getMonth()) {
        if(!result.length) {
            let cache = new Date(year, month, num).getDay();
            while(cache) {
                result.push(null);
                cache -= 1;
            }
        }
        result.push(num);
        num++;
    }
    return result;
}