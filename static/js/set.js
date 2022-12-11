
function Footer(){
    let wh = window.screen.height;
    let footer = document.getElementsByTagName("footer")[0];
    console.log(footer)
    let ft = footer.offsetTop, fh = footer.height, fm = footer.style.marginTop;
    console.log(wh)
    console.log(ft)

    if( (ft+fh) < wh ){
        footer.style.marginTop = (fm + (wh-ft-fh)) + "px";
    }
}


document.addEventListener("DOMContentLoaded", () => {
    AOS.init();

    // navbar
    document.getElementsByClassName("active")[0].parentNode.parentNode.previousSibling.previousSibling.style.opacity = "1";

    //footer
    Footer();
})

window.addEventListener("resize", () => {
    Footer();
})