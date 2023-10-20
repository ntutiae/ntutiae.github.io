import * as elementManager from "./element-manager.js";
import { isMobile } from "./device-manager.js"

let header = document.querySelector(".calendar-header");
let calendar = document.querySelector(".calendar");

/*初始化日曆 (生成各種按鈕及元素) 
    backMonth => 前一月按鈕 被按下函式 borrowing.js Line. 249
    backMonth => 後一月按鈕 被按下函式 borrowing.js Line. 265
    refresh   => 刷新按鈕 被按下函式   borrowing.js Line. 211
    month     => 目前月份(Number)

    return => {
        forwardBtn => 後一月按鈕元素 HTMLElement
        backBtn    => 前一月按鈕元素 HTMLElement
        refreshBtn => 重新整理按鈕元素 HTMLElement
        textBase   => 檢視月份元素
    }
*/
export function webInit(backMonth, forwardMonth, refresh, month) {
    /* 生成前一月按鈕 */
    let backBtn = elementManager.createElement({ 
        tag: "button",
        onclick: backMonth,
        childs: [ //子元素 => icon
            elementManager.createElement({
                tag: "span", 
                classes: ["material-symbols-outlined"],
                innerHTML: "arrow_back_ios"
            })
        ]
    });

    /* 生成目前檢視月份元素 */
    let textBase = elementManager.createElement({ 
        tag: "span", 
        innerHTML: `${month} 月` 
    });

    /* 生成後一月按鈕 */
    let forwardBtn = elementManager.createElement({ 
        tag: "button",
        onclick: forwardMonth,
        childs: [ //子元素 => icon
            elementManager.createElement({  
                tag: "span", 
                classes: ["material-symbols-outlined"],
                innerHTML: "arrow_forward_ios"
            })
        ]
    });

    /*  創建 日曆Header 的 Btns 空間 
        (原定 刷新按鈕置右 故子元素無包含刷新按鈕)
    */
    elementManager.createElement({
        tag: "span",
        classes: ["header-btns"],
        childs: [ backBtn, textBase, forwardBtn],
        appendTo: header
    });

    /* 生成刷新按鈕 */
    let refreshBtn = elementManager.createElement({
        tag: "button",
        onclick: refresh,
        classes: ["refresh-btn"],
        appendTo: header,
        childs: [ //子元素 => icon
            elementManager.createElement({
                tag: "span",
                classes: ["material-symbols-outlined"],
                innerHTML: "refresh"
            })
        ]
    });

    return { backBtn, textBase, forwardBtn, refreshBtn }; //回傳 main 區需求元素
}

/* 日曆介面浮動設定 (限移動端) */ 
export function interfaceSetting(mobile) {
    if(!mobile) return; //非移動端停止執行

    let calendarInterface = document.querySelector("#interface");
    calendarInterface.style = "";
    /* 檢測在無class限制情況 介面大小是否大於日曆的顯示大小 */
    if(calendarInterface.offsetWidth > (calendar.scrollWidth * 0.65)) {
        /* 限縮日曆介面的大小 */
        calendarInterface.style = `width: ${(calendar.scrollWidth * 0.78)}px;`;
    }
    else {
        /* 不限制日曆介面的大小 (可能Overflow 有Scroll) */
        calendarInterface.style = "";
    }
}

/* 監聽視窗尺寸變更事件 */
export function addCalendarResizeListener(dateChange, mobile) {
    /* 發生 resize 時執行指定 function*/
    addEventListener("resize", (_) => {
        if(mobile !== isMobile()) { //移動端判斷與記錄不同 (移動端、電腦端互換)
            mobile = !mobile; //變更紀錄
            if(mobile) { //變換為移動端介面
                /* 日曆設定此 style */
                calendar.style = "transform-origin: top left;scale: 0.7;";
            }
            else { //變換為電腦端介面
                /* 日曆移除 style */
                calendar.style = "";
                /* 日曆介面設為 寬度90% */
                document.querySelector("#interface").style = "width: 90%;";
            }
            /* 日期重新生成(並且不要執行 interfaceSetting) */
            dateChange(null, "change");
        }

        /* 設定介面 Line. 82
            mobile => Boolean
        */
        interfaceSetting(mobile);
    });
}