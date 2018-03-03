/*global  $*/
/*eslint no-console: 0
no-unused-vars:0*/
let required  = Object.defineProperty(self, "required", {
    get () { throw new TypeError("param is required"); }
});
let orders = {};
let server ="http://dc-coffeerun.herokuapp.com/api/coffeeorders";

let getSelectedSize = function getSelectedSize(){
    for  (let radioButton of form.querySelectorAll(".sizeSelector")){
        if (radioButton.checked === true){
            return radioButton.value;
        }
    }
};

let formValues = function formValues(form = required,
    callback = required){
    form = $(form);
    let formValues = form.serializeArray();
    formValues.forEach(function(value){
        callback(value);
    });
};
$(window).on("beforeunload", function(){
    formValues(form, function(field){
        sessionStorage.setItem(field["name"], field["value"]);
        console.log(field["name"],field["value"]);
    });
});
$(window).ready(function(){
    formValues(form,function(field){
        $(`.form-container [name="${field["name"]}"]`).val(
            sessionStorage.getItem(field["name"]));
    });
    let size = sessionStorage.getItem("size");
    form.querySelectorAll(".sizeSelector").forEach(function(field){
        if (field.value === size){
            field.checked = true;
        }
    });
});
let renderOrderDisplay = function renderOrderDisplay(){
    for (let orderName in orders){
        let order = orders[orderName];
        getOrderTags(order);
        let displayItem = document.createElement("li");
        let displayItemInner = document.createElement("p");
    }
};
let createRow = function createRow
let getOrderTags =  function getOrderTags(order){
    let coffee = order["coffee"];
    let emailAddress = order["emailAddress"];
    let size = order["size"];
    let flavor = order["flavor"];
    let strength = order["strength"];
    return `Email Address: ${emailAddress} Coffee: ${coffee} `+
            `Flavor: ${flavor} Strength: ${strength} Size: ${size}`;
}


let formSubmission =  function formSubmission(){
    let submission = {};
    event.preventDefault();
    submission["coffee"] = form.querySelector("#coffeeOrder").value;
    submission["emailAddress"] = form.querySelector("#emailInput").value;
    submission["size"] = getSelectedSize(form);
    submission["flavor"] = form.querySelector("#flavorShot").value;
    submission["strength"] = form.querySelector("#strengthLevel").value;
    $.post(server,submission);
    setTimeout(function () {
        formValues(form,function(field){
            submission[field["name"]] = field["value"];
        });
    }, 2000);
    update();
    $(".form-control").val("");
};

let update = function update(){
    let orderDisplay = document.querySelector("#orderDisplay");
    let deleteTimer;
    orderDisplay.innerHTML = "";
    $.get(server,function(data){
        orders = data;

        if (Object.keys(orders).length > 0){
            for (let orderName in orders){

                let button = document.createElement("button");
                button.setAttribute("label",`Remove Order ${order["emailAddress"]}`);
                button.textContent = "Remove Order";
                button.classList.add("btn","btn-default");

                displayItem.classList.add("displayItem");
                displayItemInner.classList.add("displayItemInner");
                let text = "";




                button.addEventListener("click", function(){
                    if (!displayItem.classList.contains("deleting")){
                        displayItem.classList.add("deleting");

                        deleteTimer = setTimeout(function(){
                            $.ajax({method:"DELETE",
                                url:server + "/" + orderName});
                            update();
                        }, 2000);
                    }
                    else{
                        clearTimeout(deleteTimer);
                        displayItem.classList.remove("deleting");
                    }
                });
                displayItemInner.textContent = text;
                displayItem.appendChild(displayItemInner);
                displayItem.appendChild(button);
                orderDisplay.appendChild(displayItem);
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
let form = document.querySelector(".form-container");
form.addEventListener("submit",formSubmission);
