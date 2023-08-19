
var mode_toggle = document.getElementById("mode-toggle");
// checked: no dark mode
// not checked: dark mode

function mode_set(){
    let mode = localStorage.getItem("mode");
    mode_toggle.checked = mode? "dark":"light";
    mode_switch();
}
function mode_switch(){
    var root = document.querySelector(':root');
    if(!mode_toggle.checked){
        root.style.setProperty("--bgcolor", "#121212");
        root.style.setProperty("--wcolor", "#f2f2f2");
        localStorage.setItem("mode", "dark");
        console.log("DARK mode");
    }else{
        root.style.setProperty("--bgcolor", "#ffffff");
        root.style.setProperty("--wcolor", "#121212");
        localStorage.setItem("mode", "light");
        console.log("NORMAL mode");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    AOS.init();

    // navbar
    document.getElementsByClassName("active")[0].parentNode.parentNode.previousSibling.previousSibling.style.opacity = "1";
    
    mode_set();
    mode_toggle.addEventListener("change", (el) => {
        mode_switch();
    })
})