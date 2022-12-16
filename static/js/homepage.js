
let hi = "IIIIIIII         A         EEEEEEE\n   II           AAA        E      \nIIIIIIII      A     A      EEEEEEE\n";

function Homepage(){
    let spline = document.getElementById("spline");
    let title = document.getElementsByClassName("title-img")[0];
    // spline.style.height = window.screen.height;
    if(window.screen.width < 650 && window.screen.width > 450){
        spline.src = "https://my.spline.design/copy-21a18c0a3c14c56c3c5e7b954bba2f8c/";  //mobile
        title.style.width = "35%";
    }else if(window.screen.width < 991 && window.screen.width > 650){
        spline.src = "https://my.spline.design/-f801562f446c553adaa89686a921be46/";  //pc
        title.style.width = "35%";
    }else if(window.screen.width < 450){
        spline.src = "https://my.spline.design/copy-21a18c0a3c14c56c3c5e7b954bba2f8c/";  //mobile
        title.style.width = "60%";
    }else{
        spline.src = "https://my.spline.design/-f801562f446c553adaa89686a921be46/";  //pc
        title.style.width = "25%";
    }
}

function Feature(){
    let f = document.getElementsByClassName("feature");
    f.forEach(el => {
        let f_input = el.children[0]; 
        if(window.screen.width < 991){
            f_input.checked = true;
        }else{
            f_input.checked = false;
        }
    });    
}


document.addEventListener("DOMContentLoaded", () => {
    console.log(hi);
    Homepage();
    Feature();
})
window.addEventListener("resize", () => {
    console.log("window width:" + window.screen.width + "; window height: " + window.screen.height)
    Homepage();
    Feature();
})