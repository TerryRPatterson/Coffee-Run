/*global  $*/
/*eslint no-console: 0*/
let required = () => { throw new Error("param is required"); };
let server ="https://dc-coffeerun.herokuapp.com/api/coffeeorders";

let getSelectedSize = function getSelectedSize(){
    for  (let radioButton of form.querySelectorAll(".sizeSelector")){
        if (radioButton.checked === true){
            return radioButton.value;
        }
    }
};

let formValues = function formValues(form = required(),
    callback = required()){
    form = $(form);
    let formValues = form.serializeArray();
    formValues.forEach(function(value){
        callback(value);
    });
};
$(window).on("beforeunload", function(){
    formValues(form, function(field){
        sessionStorage.setItem(field["name"], field["value"]);
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
let createRow = function createRow(order,display){
    let deleteTimer;
    let displayItem = document.createElement("li");
    let displayItemInner = document.createElement("p");
    displayItem.classList.add("displayItem");
    displayItemInner.classList.add("displayItemInner");
    displayItemInner.textContent =
            `Email Address: ${order["emailAddress"]} Coffee: ${order["coffee"]}`+
            ` Flavor: ${order["flavor"]}`+
            ` Strength: ${order["strength"]} Size: ${order["size"]}`;
    let button = document.createElement("button");
    button.textContent = "Remove Order";
    button.classList.add("btn","btn-default");
    button.addEventListener("click", function(){
        if (!displayItem.classList.contains("deleting")){
            displayItem.classList.add("deleting");
            deleteTimer = setTimeout(function(){
                let deletePromise =  fetch(server + "/" + order["emailAddress"],
                    {method:"DELETE"});
                deletePromise.then(update);
            }, 2000);
        }
        else{
            clearTimeout(deleteTimer);
            displayItem.classList.remove("deleting");
        }
    });
    displayItem.appendChild(displayItemInner);
    displayItem.appendChild(button);
    display.appendChild(displayItem);
};


let formSubmission =  function formSubmission(){
    let submission = {};
    event.preventDefault();
    formValues(form,function(entry){
        submission[entry.name] = entry.value;
    });
    submission["size"] = getSelectedSize(form);
    let infoSent = fetch(server,
        {method: "POST",
            body: JSON.stringify(submission),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        });
    infoSent.then(update);
    setTimeout(function () {
        formValues(form,function(field){
            submission[field["name"]] = field["value"];
        });
    }, 2000);
    update();
    form.reset();
};

let update = function update(){
    let orderDisplay = document.querySelector("#orderDisplay");
    orderDisplay.innerHTML = "";
    let serverResponse = fetch(server);
    serverResponse.then(function(data){
        data.json().then(function(orders){
            console.log(orders);
            if (Object.keys(orders).length > 0){
                for (let orderName in orders){
                    createRow(orders[orderName],orderDisplay);
                }
            }
            else{
                let displayItem = document.createElement("li");
                displayItem.textContent = "No Orders";
                orderDisplay.appendChild(displayItem);
            }
        });
    });
};

update();

let form = document.querySelector(".form-container");
form.addEventListener("submit",formSubmission);
