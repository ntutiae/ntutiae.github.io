import * as elementManager from "./element-manager.js";
import * as request from "./request.js";
import * as dateUtil from "./date-util.js";
import { webInit, interfaceSetting, addCalendarResizeListener } from "./borrowing-init.js"
import { isMobile } from "./device-manager.js"

let API = "https://script.google.com/macros/s/AKfycbxbhboysUkD4bZCO9qmgPZbFCjC8-5rEHnFDhneVDDJ1AnFV4TqNN5q-tUoUlBgUeVgKw/exec";
let calendar = document.querySelector(".calendar");
let { year, month } = dateUtil.getDateJSON();

(async () => {
    /* 
        電腦端 ->
            HTMLElement #interface 日曆介面 寬度鎖定90%
        移動端 -> 
            日曆尺寸縮小 x0.7
    */
    if(!isMobile()) document.querySelector("#interface").style = "width: 90%;";
    else calendar.style = "transform-origin: top left;scale: 0.7;";

    let calendarData = await request.GET(`https://cdn.jsdelivr.net/gh/ruyut/TaiwanCalendar/data/${year}.json`, null, true);

    /* 若月份 < 3 合併前一年的假日資料 */
    if(month < 3) calendarData = calendarData.concat( await request.GET(`https://cdn.jsdelivr.net/gh/ruyut/TaiwanCalendar/data/${year - 1}.json`, null, true) );

    /* 若月份 > 10 合併後一年的假日資料 */
    if(month > 10) calendarData = calendarData.concat( await request.GET(`https://cdn.jsdelivr.net/gh/ruyut/TaiwanCalendar/data/${year + 1}.json`, null, true) );
    
    /*過濾出所有不可借用日期 ex. 
    holiday => [
        {   
            date: "20200101", 
            "week": "三", 
            "isHoliday": true, 
            "description": "開國紀念日"
        }
        ......
    ]
    */
    let holiday = calendarData.filter(d => d.isHoliday || d.week === "五" || d.week === "六" || d.week === "日");

    /*取得API(借用紀錄 試算表) 資料 ex.
        record => [
            [
                "20231018", (日期)
                "上午 9:00～12:00", (時段)
                true, (承辦人員簽名)
                true, (科學會會長簽名)
                true, (是否已繳交使用後照片)
                false (是否經過老師簽名 限晚上時段)
            ]
        ]
    */
    let record = await request.GET(API, null, true);

    /* 執行 main 區 */
    main(holiday, record);
})();

function main(holiday, record) {
    //dateStr => YYYYMMDD String
    const isHoliday = (dateStr) => Boolean( holiday.filter(d => d.date === dateStr ).length );
    const getReason = (dateStr) => holiday.filter(d => d.date === dateStr )[0]["description"];

    /* 更新按鈕狀態 */
    const buttonChange = () => {
        /* 設定按鈕為可被點擊 */
        forwardBtn.disabled = false; 
        backBtn.disabled = false;

        /* 若目前檢視月份與目前相差 > 2 即停用 */
        if((month % 12) === (new Date().getMonth() - 1) % 12) backBtn.disabled = true;
        if((month % 12) === (new Date().getMonth() + 3) % 12) forwardBtn.disabled = true;
    }

    /*獲取日期狀態
        dateStr => YYYYMMDD
        timeStr => 上午 || 下午 || 晚上 

        return => ["idle", "閒置"] || ["apply", "審核中"] || ["used", "已占用"] || ["waiting", "缺照片"] || ["complate", "完成"]
    */ 
    const getStatus = (dateStr, timeStr) => {

        /* 過濾出指定時段的借用紀錄資料 ex.
            [
                "20231018", (日期)
                "上午 9:00～12:00", (時段)
                true, (承辦人員簽名)
                true, (科學會會長簽名)
                true, (是否已繳交使用後照片)
                false (是否經過老師簽名 限晚上時段)
            ]
        */
        let dat = record.filter(e => e[0] === dateStr && e[1].startsWith(timeStr));

        if(!dat.length) return ["idle", "閒置"]; //指定時段沒有借用紀錄資料

        if(Number(dateStr) < Number( dateUtil.getDateStr() )) { //如果日期已過
            if(timeStr.startsWith("晚上")) { //如果時段在晚上 
                if(!(dat[0][2] && dat[0][3] && dat[0][5])) return ["idle", "閒置"]; //沒借到教室
                else dat[0][4] ? ["complate", "完成"] : ["waiting", "缺照片"]; //三個勾選框都有勾(有借到教室)
            }  

            if(!(dat[0][2] && dat[0][3])) return ["idle", "閒置"]; //沒借到教室
            return dat[0][4] ? ["complate", "完成"] : ["waiting", "缺照片"]; //兩個勾選框都有勾(有借到教室)
        }

        if(timeStr.startsWith("晚上")) return (dat[0][2] && dat[0][3] && dat[0][5]) ? ["used", "已占用"] : ["apply", "審核中"]; //檢驗三個勾選框是否都勾
        return (dat[0][2] && dat[0][3]) ? ["used", "已占用"] : ["apply", "審核中"]; //檢驗兩個勾選框是否都勾
    }

    /* 創建借用狀態元素(HTMLElement) 
        dateStr => YYYYMMDD
        timeStr => 上午 9:00～12:00 || 下午 13:00～17:00 || 晚上 19:00~22:00
        urlDateStr => YYYY-MM-DD
        dateBase => HTMLElement #date (小圓框 日期元素)

        return => null;
    */
    const createStatus = (dateStr, timeStr, urlDateStr, dateBase) => {
        
        /* 獲取指定日期、時段狀態 
            dateStr => YYYYMMDD
            timeStr.silse(0, 2) => 上午 || 下午 || 晚上
            
            status => ["idle", "閒置"] || ["apply", "審核中"] || ["used", "已占用"] || ["waiting", "缺照片"] || ["complate", "完成"] 
        */
        let status = getStatus( dateStr, timeStr.slice(0, 2) );
        
        elementManager.createElement({ //創建新元素
            tag: "a",
            classes: [ "status", status[0] ], //status[0] => idle || apply || used || waiting || complate
            innerHTML: `${timeStr.slice(0, 2)} ${status[1]}`, //`${上午 || 下午 || 晚上} ${閒置 || 審核中 || 已佔用 || 缺照片 || 完成}`
            href: status[0] === "idle" ? getFormURL(urlDateStr, timeStr) : null, //若為閒置 則設定點擊後跳轉到表單
            target: "_blank",
            appendTo: dateBase //將此元素添加到 HTMLElement #date (小圓框 日期元素) 中
        });
    }

    /*
        重新生成月分內的的日期元素
        loading => HTMLElement .foot (loading 圖示)
        doNotRefresh => 單純有資料時不要刷新介面(Interface) (不要執行 interfaceSetting)

        return => null
    */
    const dateChange = async (loading, doNotRefresh=null) => {
        mobile = isMobile();

        //選取目前在日曆裡的日期元素 播放物件消失動畫
        let dates = [...calendar.querySelectorAll(".date")];
        dates.forEach(ele => ele.classList.add("hide"));

        //等待動畫結束
        await sleep(200);

        //如有 loading 圖示 則刪除
        if(loading) loading.remove();

        /*取得此月的日曆 ex.
            ----------------------------------------
            Sun.  Mon.  Tue.  Wed.  Thu.  Fri.  Sat.
                        1     2     3     4     5
            6     7     8     9     10    11    12
            13    14    15    16    17    18    19
            20    21    22    23    24    25    26
            27    28    29    30    31
            ----------------------------------------

            則 monthDates => [null, null, 1, 2, 3 ........., 31]
            (兩個 null 填充前面兩個空日期)
        */
        let monthDates = dateUtil.getDaysInMonth(year, month);
        for(let monthDate of monthDates) { //尋一遍日期 null, null, 1, 2, 3......

            /* 獲取日期字串 dateStr => YYYYMMDD */
            let dateStr = dateUtil?.getDateStr( dateUtil.getDateFromNumber(year, month, monthDate) );

            /* 生成日期元素 */
            let dateBase = elementManager.createElement({
                tag: "span",
                classes: [ 
                    "date", 
                    monthDate ? "show" : "hidden", //如果 monthDate 不為 null 顯示 否則隱藏
                    isHoliday( dateStr ) ? "disabled-date" : null //如果是假日 標示為紅色
                ],
                style: !mobile ? "aspect-ratio: 1.2;" : null, //日期元素 電腦與移動端不同
                childs: [ //子元素列表
                    
                    /* 若此日期不為 null 則生成此元素 日期標題 ex. 1 || 2 || 3 ...... */
                    (monthDate) ? elementManager.createElement({
                        tag: "span",
                        classes: ["title"],
                        style: !mobile ? "margin-right: auto;padding-left: 10px;" : null,
                        innerHTML: String( monthDate ),
                    }) : null,

                    /* 若今天為假日 則生成此元素 假日原由 ex. 中秋節...... 國慶日...... */
                    isHoliday( dateStr ) ? elementManager.createElement({
                        tag: "div",
                        classes: ["content"],
                        innerHTML: getReason( dateStr ) || "" //如果沒資料 則為空元素 反之將元素裡的文字設定為原由
                    }) : null
                ],
                appendTo: calendar //將此 元素(dateBase) 添加到 日曆(calendar) 中
            })

            if(isHoliday( dateStr )) continue; //若不為假日 則繼續執行

            /* 生成今日借用狀態列表 */

            /* 取得適用於 FormURL 的 日期字串 YYYY-MM-DD */
            let urlDateStr = dateUtil.getDateStr( dateUtil.getDateFromNumber(year, month, monthDate), "-");

            /* 生成元素(並添加到此 元素dataBase 當中) Line. 98 */
            createStatus(dateStr, "上午 9:00～12:00", urlDateStr, dateBase);
            createStatus(dateStr, "下午 13:00～17:00", urlDateStr, dateBase);
            createStatus(dateStr, "晚上 19:00~22:00", urlDateStr, dateBase);
        }

        /* interfaceSetting => 日曆介面浮動設定 (限移動端) */ 
        /* 如呼叫函式時 不包括此資料(doNotRefresh)
           則執行 interfaceSetting() 
           ( borrowing-init.js Line. 82 ) */
        if(!doNotRefresh) interfaceSetting(mobile);

        /*延遲 1ms 
          刪除所有已被套上消失動畫的日期元素 
          並刷新按鈕狀態 ( 檢驗目前檢視月份是否該停用按鈕 )*/
        await sleep(1);
        dates.forEach(ele => ele.remove());
        buttonChange();
    }

    //當 刷新按鈕 被按下時
    const refresh = async () => {
        //禁用所有按鈕 (前一月 後一月 刷新按鈕)
        backBtn.disabled = true;
        forwardBtn.disabled = true;
        refreshBtn.disabled = true;

        //選取目前在日曆裡的日期元素 播放物件消失動畫
        let allDates = [...calendar.querySelectorAll(".date")];
        allDates.forEach(ele => ele.classList.add("hide"));
        
        //等待動畫結束
        await sleep(200);
        
        //刪除所有日期元素
        allDates.forEach(ele => ele.remove());

        //將日曆換上 Loading... 圖示
        let loading = elementManager.createElement({
            tag: "span",
            classes: ["foot"],
            childs: [
                elementManager.createElement({
                    tag: "span",
                    classes: ["loader"]
                })
            ],
            appendTo: calendar
        });

        //從API取得目前最新的借用紀錄資料
        record = await request.GET(API, null, true);

        /* 重新生成日期元素、刷新按鈕狀態(並把 loading 刪除) Line. 126 */
        dateChange(loading);
        refreshBtn.disabled = false; //生成結束後啟用 重新整理 按鈕
    }

    //當 前一月按鈕 被按下
    const backMonth = () => {
        //禁用按鈕 (前一月 後一月)
        forwardBtn.disabled = true; 
        backBtn.disabled = true;

        /* 月份數-1 重新獲取日期 (確保月份不會變成 0 or 13) */
        month -= 1;
        month = new Date(year, month-1).getMonth() + 1;
        /* 調整日曆顯示的檢視月份 */
        textBase.innerHTML = `${month} 月`;

        /* 重新生成日期元素、刷新按鈕狀態 Line. 126 */
        dateChange();
    }

    //當 後一月 按鈕被按下
    const forwardMonth = () => {
        //禁用按鈕 (前一月 後一月)
        forwardBtn.disabled = true;
        backBtn.disabled = true;

        /* 月份數+1 重新獲取日期 (確保月份不會變成 0 or 13) */
        month += 1;
        month = new Date(year, month-1).getMonth() + 1;
        /* 調整日曆顯示的檢視月份 */
        textBase.innerHTML = `${month} 月`;

        /* 重新生成日期元素、刷新按鈕狀態 Line. 126 */
        dateChange();
    }

    /* 以下為 main 直接執行區 ( 上面皆為定義函式 )*/

    let mobile = isMobile(); //檢測是否為移動端畫面 ( 以螢幕寬度是否>1200px 當作基準 )

    /*初始化日曆 (生成各種按鈕及元素) borrowing-init.js Line. 18
        backMonth => 前一月按鈕 被按下函式 Line. 249
        backMonth => 後一月按鈕 被按下函式 Line. 265
        refresh   => 刷新按鈕 被按下函式   Line. 211
        month     => 目前月份(Number)

        forwardBtn => 後一月按鈕元素 HTMLElement
        backBtn    => 前一月按鈕元素 HTMLElement
        refreshBtn => 重新整理按鈕元素 HTMLElement
        textBase   => 檢視月份元素
    */
    let { forwardBtn, backBtn, refreshBtn, textBase } = webInit(backMonth, forwardMonth, refresh, month);

    /* 生成所有日期元素(並把 loading 刪除) Line. 126 */
    dateChange( document.querySelector(".foot") );
    
    /* 監聽視窗尺寸變更事件 (隨時將日曆元素修改為適當尺寸) 
        dateChange => Function Line. 126
        mobile => Boolean
    */
    addCalendarResizeListener(dateChange, mobile);
}

function getFormURL(date, time) {
    return `https://docs.google.com/forms/d/e/1FAIpQLSeWdLOfKln8piSEORmrpXM86wGsx6HPtVC1OEWbQiYo7GDlNw/viewform?usp=pp_url&entry.540117387=${date}&entry.37487545=${time}`;
}

function sleep(time) {
    return new Promise((resolve, _) => {
        setTimeout(() => resolve(true), time);
    });
}