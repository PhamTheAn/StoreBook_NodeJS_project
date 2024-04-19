const { JSON } = require("sequelize");
const { Json } = require("sequelize/types/utils");

var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:
        // document.getElementById("demo").innerHTML = xhttp.responseText;
        console.log(xhttp.responseText);  // trả về dữ liệu kiểu string
        JSON.parse(xhttp.responseText)// đảo lại kiểu dữ liệu là json
    }else {
        console.log("err");
    }
}

xhttp.open("GET", "url", true);
xhttp.send();