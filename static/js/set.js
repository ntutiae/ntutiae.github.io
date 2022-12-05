
function Footer(){
    let wh = window.screen.height;
    let footer = document.getElementsByClassName("footer")[0]
    let ft = footer.scrollHeight, fh = footer.height, fm = footer.style.marginTop;

    if( (ft+fh) < wh ){
        let n = (wh-ft-fh);
        fm = (fm + n) + "px";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // navbar
    document.getElementsByClassName("active")[0].parentNode.parentNode.previousSibling.previousSibling.style.opacity = "1";
})

window.addEventListener("resize", () => {
    Footer();
})