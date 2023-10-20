(async () => {
    let mobile = is_mobile();
    if(!mobile) document.querySelector("#interface").style = "width: 90%;";
    else document.querySelector(".calendar").style = "transform-origin: top left;scale: 0.7;";

    let API = "https://script.google.com/macros/s/AKfycbxbhboysUkD4bZCO9qmgPZbFCjC8-5rEHnFDhneVDDJ1AnFV4TqNN5q-tUoUlBgUeVgKw/exec";
    let header = document.querySelector(".calendar-header");

    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    
    let res = await fetch(`https://cdn.jsdelivr.net/gh/ruyut/TaiwanCalendar/data/${year}.json`);
    let dat = await res.json();
    holiday = dat.filter(d => d.isHoliday || d.week === "五" || d.week === "六" || d.week === "日");

    let res_2 = await fetch(API);
    let record = await res_2.json();

    back_btn = document.createElement("button");
    forward_btn = document.createElement("button");

    let back_icon = document.createElement("span");
    back_icon.classList.add("material-symbols-outlined");
    back_icon.innerHTML = "arrow_back_ios";

    let forward_icon = document.createElement("span");
    forward_icon.classList.add("material-symbols-outlined");
    forward_icon.innerHTML = "arrow_forward_ios";

    back_btn.appendChild( back_icon );
    forward_btn.appendChild( forward_icon );

    let text_base = document.createElement("span");
    text_base.innerHTML = `${month} 月`;

    let refresh_btn = document.createElement("button"); 
    let refresh_icon = document.createElement("span");
    refresh_icon.classList.add("material-symbols-outlined");
    refresh_icon.innerHTML = "refresh"
    refresh_btn.appendChild(refresh_icon);
    refresh_btn.classList.add("refresh-btn");

    let header_btns = document.createElement("span");
    header_btns.classList.add("header-btns");
    header_btns.appendChild(back_btn);
    header_btns.appendChild(text_base);
    header_btns.appendChild(forward_btn);

    header.appendChild(header_btns);
    header.appendChild(refresh_btn);

    set_dat(year, month, text_base, holiday, back_btn, forward_btn, refresh_btn, record, API);
})();


function set_dat(year, month, text_base, holiday, back_btn, forward_btn, refresh_btn, record, API) {
    const is_holiday = (dateStr) => Boolean( holiday.filter(d => d.date === dateStr ).length );
    const get_reason = (dateStr) => holiday.filter(d => d.date === dateStr )[0]["description"];

    let interface = document.querySelector("#interface");
    let base = document.querySelector(".calendar");
    let mobile = is_mobile();

    const interface_setting = () => {
        if(!mobile) return;
        interface.style = "";
        console.log(base.scrollWidth * 0.65);
        if(interface.offsetWidth > (base.scrollWidth * 0.65)) {
            interface.style = `width: ${(base.scrollWidth * 0.78)}px;`;
        }
        else {
            interface.style = "";
        }
    }

    const get_formURL = (date, time) => {
        return `https://docs.google.com/forms/d/e/1FAIpQLSeWdLOfKln8piSEORmrpXM86wGsx6HPtVC1OEWbQiYo7GDlNw/viewform?usp=pp_url&entry.540117387=${date}&entry.37487545=${time}`;
    }

    const refresh = async () => {
        back_btn.disabled = true;
        forward_btn.disabled = true;
        refresh_btn.disabled = true;
        let dates = [...base.querySelectorAll(".date")];
        dates.forEach(ele => ele.classList.add("hide"));
        await sleep(201);
        dates.forEach(ele => ele.remove());

        let loading = document.createElement("span");
        loading.classList.add("foot");

        let loading_icon = document.createElement("span");
        loading_icon.classList.add("loader");

        loading.appendChild( loading_icon );
        base.appendChild(loading);

        let res = await fetch(API);
        record = await res.json();

        button_change();
        refresh_btn.disabled = false
        date_change(loading);
    }

    const button_change = () => {
        forward_btn.disabled = false;
        back_btn.disabled = false;
        if((month % 12) === (new Date().getMonth() - 1) % 12) back_btn.disabled = true;
        if((month % 12) === (new Date().getMonth() + 3) % 12) forward_btn.disabled = true;
    }

    const get_status = (dateStr, time) => {
        let dat = record.filter(e => e[0] === dateStr && e[1].startsWith(time));

        if(dat.length) {
            if(Number(dateStr) < Number(getNowDateStr())) {
                if(time.startsWith("晚上")) {
                    if(!(dat[0][2] && dat[0][3] && dat[0][5])) return ["idle", "閒置"];
                    else dat[0][4] ? ["complate", "完成"] : ["waiting", "缺照片"];
                }  
                if(!(dat[0][2] && dat[0][3])) return ["idle", "閒置"];
                return dat[0][4] ? ["complate", "完成"] : ["waiting", "缺照片"];
            }
            if(time.startsWith("晚上")) return (dat[0][2] && dat[0][3] && dat[0][5]) ? ["used", "已占用"] : ["apply", "審核中"];
            return (dat[0][2] && dat[0][3]) ? ["used", "已占用"] : ["apply", "審核中"];
        }
        return ["idle", "閒置"];
    }

    const date_change = (loading, event=null) => {
        let dates = [...base.querySelectorAll(".date")];
        dates.forEach(ele => ele.classList.add("hide"));
        setTimeout(() => dates.forEach(ele => ele.remove()), 201);

        setTimeout(() => {
            if(loading) loading.remove();
            let days = getDaysInMonth(year, month);
            for(let day of days) {
                let ele = document.createElement("span");
                ele.classList.add("date");
                if(!mobile) ele.style = "aspect-ratio: 1.2;";
                
                if(!day) ele.classList.add("hidden");
                else {
                    let title = document.createElement("span");
                    title.classList.add("title");
                    if(!mobile) title.style = "margin-right: auto;padding-left: 10px;";
                    title.innerHTML = String(day);
                    ele.appendChild( title );
                }

                let dateStr = date2str(year, month, day);
                if(is_holiday( dateStr )) {
                    let reason = get_reason( dateStr );
                    ele.classList.add("disabled-date");
        
                    let content = document.createElement("div");
                    content.classList.add("content");
                    content.innerHTML = reason || "";
        
                    ele.appendChild(content);
                }
                else {
                    let morning = document.createElement("a");
                    let morning_status = get_status( dateStr, "上午" );
                    morning.classList.add("status");
                    morning.classList.add(morning_status[0]);
                    morning.innerHTML = `上午 ${morning_status[1]}`;
                    if(morning_status[0] === "idle") morning.href = get_formURL(date2str(year, month, day, "-"), "上午 9:00～12:00");
                    morning.target = "_blank";
        
                    let afternoon = document.createElement("a");
                    let afternoon_status = get_status( dateStr, "下午" );
                    afternoon.classList.add("status");
                    afternoon.classList.add(afternoon_status[0]);
                    afternoon.innerHTML = `下午 ${afternoon_status[1]}`;
                    if(afternoon_status[0] === "idle") afternoon.href = get_formURL(date2str(year, month, day, "-"), "下午 13:00～17:00");
                    afternoon.target = "_blank";

                    let evening = document.createElement("a");
                    let evening_status = get_status( dateStr, "晚上" );
                    evening.classList.add("status");
                    evening.classList.add(evening_status[0]);
                    evening.innerHTML = `晚上 ${evening_status[1]}`;
                    if(evening_status[0] === "idle") evening.href = get_formURL(date2str(year, month, day, "-"), "晚上 19:00~22:00");
                    evening.target = "_blank";
                    
                    ele.appendChild(morning);
                    ele.appendChild(afternoon);
                    ele.appendChild(evening);
                }
                ele.classList.add("show");
                base.appendChild(ele);
            }
            if(!event) interface_setting();
        }, 200);
    }

    const back_month = () => {
        month -= 1;
        month = new Date(year, month-1).getMonth() + 1;
        text_base.innerHTML = `${month} 月`;

        button_change();
        date_change();
    }

    const forward_month = () => {
        month += 1;
        month = new Date(year, month-1).getMonth() + 1;
        text_base.innerHTML = `${month} 月`;

        button_change();
        date_change();
    }

    back_btn.onclick = back_month;
    forward_btn.onclick = forward_month;
    refresh_btn.onclick = refresh;
    
    addEventListener("resize", (_) => {
    	if(mobile !== is_mobile()) {
    	    mobile = !mobile;
    	    if(mobile) {
    	    	base.style = "transform-origin: top left;scale: 0.7;";
    	    }
    	    else {
    	        base.style = "";
    	    	document.querySelector("#interface").style = "width: 90%;";
    	    }
    	    date_change(null, "change");
            interface_setting();
    	}
        else interface_setting();
    });

    date_change( document.querySelector(".foot") );
}

function getNowDateStr() {
    let day = new Date();
    let year = day.getFullYear();
    let month = day.getMonth() + 1;
    let date = day.getDate();

    return date2str(year, month, date);
}

function date2str(year, month, date, char = "") {
    return `${year}${char}${String(month).padStart(2, "0")}${char}${String(date).padStart(2, "0")}`
} 

function getDaysInMonth(year, month) {
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

function sleep(time) {
    return new Promise((resolve, _) => {
        setTimeout(() => resolve(true), time);
    });
}

function is_mobile() {
    return document.body.offsetWidth < 1200;
}
