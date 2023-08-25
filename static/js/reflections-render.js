let menu = document.querySelector("#menu");
let video_list = document.querySelector("#reflections");

function summon_grade(link = null) {
    menu.innerHTML = '<span class="loader"></span>';
    
    if(!link) {
        let ele = document.querySelector("#link");
        ele.classList.add("mytabs-active");
        return ele.click();
    }

    [...document.querySelector("#link").parentElement.children].forEach(ele => {
        if(ele.href.includes(link)) ele.classList.add("mytabs-active", "disabled");
        else ele.classList.remove("mytabs-active", "disabled");
    });
    
    $.ajax({
        url: link,
        method: 'GET',
        dataType: 'html',
        success: res =>{
            menu.innerHTML = res;
            summon_vid();
        },
        error: err =>{
            console.log(err)
        },
    });
}


function summon_vid(link = null) {
    video_list.innerHTML = '<span class="loader" style="margin-left: calc(50% - 24px);"></span>';
    
    if(!link) {
        let ele = document.querySelector("#grade");
        ele.classList.add("mytabs-active", "disabled");
        return ele.click();
    }

    [...document.querySelector("#grade").parentElement.children].forEach(ele => {
        if(ele.href.includes(link)) ele.classList.add("mytabs-active", "disabled");
        else ele.classList.remove("mytabs-active", "disabled");
    });

    $.ajax({
        url: link,
        method: 'GET',
        dataType: 'html',
        success: res => {
            video_list.innerHTML = res;
        },
        error: err =>{
            console.log(err)
        },
    });
}

[...document.querySelectorAll("#link")].toReversed()[0].click();