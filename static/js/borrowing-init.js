import * as elementManager from "./element-manager.js";

let header = document.querySelector(".calendar-header");

export function webInit(backMonth, forwardMonth, refresh, month) {
    let backBtn = elementManager.createElement({ 
        tag: "button",
        onclick: backMonth,
        childs: [ 
            elementManager.createElement({ 
                tag: "span", 
                classes: ["material-symbols-outlined"],
                innerHTML: "arrow_back_ios"
            })
        ]
    });

    let textBase = elementManager.createElement({ 
        tag: "span", 
        innerHTML: `${month} 月` 
    });

    let forwardBtn = elementManager.createElement({ 
        tag: "button",
        onclick: forwardMonth,
        childs: [ 
            elementManager.createElement({ 
                tag: "span", 
                classes: ["material-symbols-outlined"],
                innerHTML: "arrow_forward_ios"
            })
        ]
    });

    elementManager.createElement({
        tag: "span",
        classes: ["header-btns"],
        childs: [ backBtn, textBase, forwardBtn],
        appendTo: header
    });

    let refreshBtn = elementManager.createElement({
        tag: "button",
        onclick: refresh,
        classes: ["refresh-btn"],
        appendTo: header,
        childs: [
            elementManager.createElement({
                tag: "span",
                classes: ["material-symbols-outlined"],
                innerHTML: "refresh"
            })
        ]
    });

    return { backBtn, textBase, forwardBtn, refreshBtn }
}

export function interfaceSetting(mobile) {
    if(!mobile) return;

    let calendarInterface = document.querySelector("#interface");
    calendarInterface.style = "";
    if(calendarInterface.offsetWidth > (calendar.scrollWidth * 0.65)) {
        calendarInterface.style = `width: ${(calendar.scrollWidth * 0.78)}px;`;
    }
    else {
        calendarInterface.style = "";
    }
}