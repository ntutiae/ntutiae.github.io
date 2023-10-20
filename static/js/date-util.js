/* 取得日期物件的 年 月 日 */
export function getDateJSON(date = new Date()) {
    let year = date?.getFullYear();
    let month = date?.getMonth() + 1;
    let monthDate = date?.getDate();

    return { year, month, monthDate }
}

/* 從數字取得指定日期物件 */
export function getDateFromNumber(year, month, monthDate) {
    if(year === null || month === null || monthDate === null) return null;
    return new Date(year, month-1, monthDate);
}

/* 回傳日期字串 
   default => YYYYMMDD
   
   可設定char
   customChar YYYY{char}MM{char}DD
*/
export function getDateStr(date = new Date(), char = "") {
    let { year, month, monthDate } = getDateJSON( date );

    return `${year}${char}${String(month).padStart(2, "0")}${char}${String(monthDate).padStart(2, "0")}`;
}

/*取得此月的日曆 ex.
    ----------------------------------------
    Sun.  Mon.  Tue.  Wed.  Thu.  Fri.  Sat.
                1     2     3     4     5
    6     7     8     9     10    11    12
    13    14    15    16    17    18    19
    20    21    22    23    24    25    26
    27    28    29    30    31
    ----------------------------------------

    則 return => [null, null, 1, 2, 3 ........., 31]
    (兩個 null 填充前面兩個空日期)
*/
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