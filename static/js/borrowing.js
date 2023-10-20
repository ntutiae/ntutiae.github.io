import * as elementManager from "./element-manager.js";
import * as request from "./request.js";
import * as dateUtil from "./date-util.js";
import { webInit, interfaceSetting } from "./borrowing-init.js"
import { isMobile } from "./device-manager.js"

let API = "https://script.google.com/macros/s/AKfycbxbhboysUkD4bZCO9qmgPZbFCjC8-5rEHnFDhneVDDJ1AnFV4TqNN5q-tUoUlBgUeVgKw/exec";
let calendar = document.querySelector(".calendar");
let { year, month } = dateUtil.getDateJSON();

(async () => {
    if(!isMobile()) document.querySelector("#interface").style = "width: 90%;";
    else calendar.style = "transform-origin: top left;scale: 0.7;";

    let calendarData = await request.GET(`https://cdn.jsdelivr.net/gh/ruyut/TaiwanCalendar/data/${new Date().getFullYear()}.json`, null, true);
    let holiday = calendarData.filter(d => d.isHoliday || d.week === "五" || d.week === "六" || d.week === "日");

    let record = await request.GET(API, null, true);

    main(holiday, record);
})();

function main(holiday, record) {
    const isHoliday = (dateStr) => Boolean( holiday.filter(d => d.date === dateStr ).length );
    const getReason = (dateStr) => holiday.filter(d => d.date === dateStr )[0]["description"];

    const buttonChange = () => {
        forwardBtn.disabled = false;
        backBtn.disabled = false;
        if((month % 12) === (new Date().getMonth() - 1) % 12) backBtn.disabled = true;
        if((month % 12) === (new Date().getMonth() + 3) % 12) forwardBtn.disabled = true;
    }

    const getStatus = (dateStr, time) => {
        let dat = record.filter(e => e[0] === dateStr && e[1].startsWith(time)); //過濾出指定時段的資料

        if(!dat.length) return ["idle", "閒置"]; //資料為空

        if(Number(dateStr) < Number( dateUtil.getDateStr() )) { //如果日期已過
            if(time.startsWith("晚上")) { //如果時段在晚上 
                if(!(dat[0][2] && dat[0][3] && dat[0][5])) return ["idle", "閒置"]; //沒借到教室
                else dat[0][4] ? ["complate", "完成"] : ["waiting", "缺照片"]; //三個勾選框都有勾(有借到教室)
            }  

            if(!(dat[0][2] && dat[0][3])) return ["idle", "閒置"]; //沒借到教室
            return dat[0][4] ? ["complate", "完成"] : ["waiting", "缺照片"]; //兩個勾選框都有勾(有借到教室)
        }

        if(time.startsWith("晚上")) return (dat[0][2] && dat[0][3] && dat[0][5]) ? ["used", "已占用"] : ["apply", "審核中"]; //檢驗三個勾選框是否都勾
        return (dat[0][2] && dat[0][3]) ? ["used", "已占用"] : ["apply", "審核中"]; //檢驗兩個勾選框是否都勾
    }

    const createStatus = (dateStr, timeStr, urlDateStr, dateBase) => {
        let status = getStatus( dateStr, timeStr.slice(0, 2) );
        elementManager.createElement({ 
            tag: "a",
            classes: [ "status", status[0] ],
            innerHTML: `${timeStr.slice(0, 2)} ${status[1]}`,
            href: status[0] === "idle" ? getFormURL(urlDateStr, timeStr) : null,
            target: "_blank",
            appendTo: dateBase
        });
    }

    const dateChange = async (loading, event=null) => {
        let dates = [...calendar.querySelectorAll(".date")];
        dates.forEach(ele => ele.classList.add("hide"));

        await sleep(200);

        if(loading) loading.remove();

        let monthDates = dateUtil.getDaysInMonth(year, month);
        for(let monthDate of monthDates) {
            let dateStr = dateUtil?.getDateStr( dateUtil.getDateFromNumber(year, month, monthDate) );

            let dateBase = elementManager.createElement({
                tag: "span",
                classes: [ 
                    "date", 
                    monthDate ? "show" : "hidden",
                    isHoliday( dateStr ) ? "disabled-date" : null
                ],
                style: !mobile ? "aspect-ratio: 1.2;" : null,
                childs: [
                    (monthDate) ? elementManager.createElement({
                        tag: "span",
                        classes: ["title"],
                        style: !mobile ? "margin-right: auto;padding-left: 10px;" : null,
                        innerHTML: String( monthDate ),
                    }) : null,

                    isHoliday( dateStr ) ? elementManager.createElement({
                        tag: "div",
                        classes: ["content"],
                        innerHTML: getReason( dateStr ) || ""
                    }) : null
                ],
                appendTo: calendar
            })

            if(isHoliday( dateStr )) continue;

            let urlDateStr = dateUtil.getDateStr( dateUtil.getDateFromNumber(year, month, monthDate), "-");

            createStatus(dateStr, "上午 9:00～12:00", urlDateStr, dateBase);
            createStatus(dateStr, "下午 13:00～17:00", urlDateStr, dateBase);
            createStatus(dateStr, "晚上 19:00~22:00", urlDateStr, dateBase);
        }
        if(!event) interfaceSetting(mobile);

        await sleep(1);
        dates.forEach(ele => ele.remove());
    }

    const refresh = async () => {
        backBtn.disabled = true;
        forwardBtn.disabled = true;
        refreshBtn.disabled = true;

        let allDates = [...calendar.querySelectorAll(".date")];
        allDates.forEach(ele => ele.classList.add("hide"));
        
        await sleep(201);
        
        allDates.forEach(ele => ele.remove());

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

        record = await request.GET(API, null, true);

        buttonChange();
        refreshBtn.disabled = false
        dateChange(loading);
    }

    const backMonth = () => {
        month -= 1;
        month = new Date(year, month-1).getMonth() + 1;
        textBase.innerHTML = `${month} 月`;

        buttonChange();
        dateChange();
    }

    const forwardMonth = () => {
        month += 1;
        month = new Date(year, month-1).getMonth() + 1;
        textBase.innerHTML = `${month} 月`;

        buttonChange();
        dateChange();
    }

    let mobile = isMobile();
    let { forwardBtn, backBtn, refreshBtn, textBase } = webInit(backMonth, forwardMonth, refresh, month);
    dateChange( document.querySelector(".foot") );
    
    addEventListener("resize", (_) => {
    	if(mobile !== isMobile()) {
    	    mobile = !mobile;
    	    if(mobile) {
    	        calendar.style = "transform-origin: top left;scale: 0.7;";
    	    }
    	    else {
    	        calendar.style = "";
    	    	document.querySelector("#interface").style = "width: 90%;";
    	    }
    	    dateChange(null, "change");
            interfaceSetting(mobile);
    	}
        else interfaceSetting(mobile);
    });
}

function getFormURL(date, time) {
    return `https://docs.google.com/forms/d/e/1FAIpQLSeWdLOfKln8piSEORmrpXM86wGsx6HPtVC1OEWbQiYo7GDlNw/viewform?usp=pp_url&entry.540117387=${date}&entry.37487545=${time}`;
}

function sleep(time) {
    return new Promise((resolve, _) => {
        setTimeout(() => resolve(true), time);
    });
}