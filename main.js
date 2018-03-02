/*global  $*/
/*eslint no-console: 0
no-unused-vars:0*/
let orders = {};
let server ="http://dc-coffeerun.herokuapp.com/api/coffeeorders";
let getSelectedSize = function getSelectedSize(){
    for  (let radioButton of form.querySelectorAll(".sizeSelector")){
        if (radioButton.checked === true){
            return radioButton.value;
        }
    }
};
$(window).on("beforeunload", function(){
    sessionStorage.setItem("coffee", $("#coffeeOrder").val());
    sessionStorage.setItem("emailAddress", $("#emailInput").val());
    sessionStorage.setItem("flavor", $("#flavorShot").val());
    sessionStorage.setItem("strength",$("#strengthLevel").val());
    let size = getSelectedSize();
    console.log("size");
    sessionStorage.setItem("size",size);
});
$(window).on("load",function(){
    $("#coffeeOrder").val(sessionStorage.getItem("coffee"));
    $("#emailInput").val(sessionStorage.getItem("emailAddress"));
    $("#flavorShot").val(sessionStorage.getItem("flavor"));
    $("#strengthLevel").val(sessionStorage.getItem("strength"));
    let size = sessionStorage.getItem("size");
    console.log(size);
    form.querySelectorAll(".sizeSelector").forEach(function(order){
        if (order.value === size){
            order.checked = true;
        }
    });
    // sessionStorage.clear();
});

let form = document.querySelector(".form-container");


let formSubmission =  function formSubmission(){
    let submission = {};
    event.preventDefault();
    submission["coffee"] = form.querySelector("#coffeeOrder").value;
    submission["emailAddress"] = form.querySelector("#emailInput").value;
    submission["size"] = getSelectedSize();
    submission["flavor"] = form.querySelector("#flavorShot").value;
    submission["strength"] = form.querySelector("#strengthLevel").value;
    $.post(server,submission);
    setTimeout(function () {
        $(".form-control").val("");
    }, 2000);
    update();
};

let update = function update(){
    let orderDisplay = document.querySelector("#orderDisplay");
    let deleteTimer;
    orderDisplay.innerHTML = "";
    $.get(server,function(data){
        orders = data;

        if (Object.keys(orders).length > 0){
            for (let orderName in orders){
                let order = orders[orderName];
                if (order){
                    let button = document.createElement("button");
                    button.setAttribute("label",`Remove Order ${order["emailAddress"]}`);
                    button.textContent = "Remove Order";
                    button.classList.add("btn");
                    button.classList.add("btn-default");
                    let displayItem = document.createElement("li");
                    let displayItemInner = document.createElement("p");
                    displayItem.classList.add("displayItem");
                    displayItemInner.classList.add("displayItemInner");
                    let text = "";
                    let coffee = order["coffee"];
                    let emailAddress = order["emailAddress"];
                    let size = order["size"];
                    let flavor = order["flavor"];
                    let strength = order["strength"];

                    text = [`Email Address: ${emailAddress} Coffee: ${coffee} `+
                            `Flavor: ${flavor} Strength: ${strength} Size: ${size}`];

                    button.addEventListener("click", function(){
                        if (!displayItem.classList.contains("deleting")){
                            displayItem.classList.add("deleting");
                            $.ajax({method:"DELETE",
                                url:server + "/" + orderName});
                            deleteTimer = setTimeout(update, 2000);
                        }
                        else{
                            clearTimeout(deleteTimer);
                            displayItem.classList.remove("deleting");
                            $.post(server, orders[orderName],update);
                        }
                    });
                    displayItemInner.textContent = text;
                    displayItem.appendChild(displayItemInner);
                    displayItem.appendChild(button);
                    orderDisplay.appendChild(displayItem);
                }
            }
        }
        else{
            let displayItem = document.createElement("li");
            displayItem.textContent = "No Orders";
            orderDisplay.appendChild(displayItem);
        }
    });
};

update();
form.addEventListener("submit",formSubmission);
