/*global  $*/
/*eslint no-console: 0
no-unused-vars:0*/
let orders = {};
let server ="http://dc-coffeerun.herokuapp.com/api/coffeeorders";

let form = document.querySelector(".form-container");


let formSubmission =  function formSubmission(){
    let submission = {};
    event.preventDefault();
    submission["coffee"] = form.querySelector("#coffeeOrder").value;
    submission["emailAddress"] = form.querySelector("#emailInput").value;
    form.querySelectorAll(".sizeSelector").forEach(function(order){
        if (order.checked === true){
            submission["size"] = order.value;
        }
    });
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
                    let text = "";
                    for (let entry in order){
                        if (order.hasOwnProperty(entry) && (entry !== "_id" &&
                    entry !== "__v")){
                            text += `${entry}: ${order[entry]} \n`;
                        }
                    }
                    button.addEventListener("click",function(){
                        setTimeout(function () {
                            $.ajax({type:"DELETE",
                                url:server + "/" + orderName});
                            update();
                        }, 2000);

                    });
                    displayItem.textContent = text;
                    displayItem.setAttribute("id",order["Order Number"]);
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
