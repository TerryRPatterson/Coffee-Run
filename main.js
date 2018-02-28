/*global  */
/*eslint no-console: 0*/
let history = window.localStorage;
if (!history.getItem("currentOrder")){
    history.setItem("currentOrder",JSON.stringify(0));
    history.setItem("orders",JSON.stringify([]));
}
let form = document.querySelector(".form-container");



let formSubmission =  function formSubmission(){
    let submission = {};
    submission["Order Number"] = currentOrder;
    event.preventDefault();
    submission["drink"] = form.querySelector("#coffeeOrder").value;
    submission["email"] = form.querySelector("#emailInput").value;
    form.querySelectorAll(".sizeSelector").forEach(function(item){
        if (item.checked === true){
            submission["size"] = item.value;
        }
    });
    submission["flavor"] = form.querySelector("#flavorShot").value;
    submission["Caffeine"] = form.querySelector("#strengthLevel").value;
    orders[currentOrder] = submission;
    currentOrder ++;
    update();
};

let update = function update(){
    let orderDisplay = document.querySelector("#orderDisplay");
    orderDisplay.innerHTML = "";
    if (orders.length > 0){
        orders.forEach(function(item){
            if (item){
                let button = document.createElement("button");
                button.setAttribute("label",`Remove Order ${item["Order Number"]}`);
                button.textContent = `Remove Order ${item["Order Number"]}`;
                button.classList.add("btn");
                button.classList.add("btn-default");
                let displayItem = document.createElement("li");
                let text = "";
                for (let entry in item){
                    text += `${entry}: ${item[entry]} \n`;
                }
                button.addEventListener("click",function(){
                    delete orders[item["Order Number"]];
                    update();
                });
                displayItem.textContent = text;
                displayItem.setAttribute("id",item["Order Number"]);
                displayItem.appendChild(button);
                orderDisplay.appendChild(displayItem);
            }
        });
    }
    else{
        let displayItem = document.createElement("li");
        displayItem.textContent = "No Orders";
        orderDisplay.appendChild(displayItem);
    }
    history.setItem("currentOrder",JSON.stringify(currentOrder));
    history.setItem("orders",JSON.stringify(orders));
};

let currentOrder = JSON.parse(history.getItem("currentOrder"));
let orders = JSON.parse(history.getItem("orders"));
update();
form.addEventListener("submit",formSubmission);
