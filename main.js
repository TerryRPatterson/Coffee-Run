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
    updateDisplay();
    history.setItem("currentOrder",JSON.stringify(currentOrder));
    history.setItem("orders",JSON.stringify(orders));
};

let updateDisplay = function updateDisplay(){
    let orderDisplay = document.querySelector("#orderDisplay");
    orderDisplay.innerHTML = "";
    if (orders.length > 0){
        orders.forEach(function(item){
            let displayItem = document.createElement("p");
            let text = "";
            for (let entry in item){
                text += `${entry}: ${item[entry]} \n`;
            }
            displayItem.textContent = text;
            orderDisplay.appendChild(displayItem);
        });
    }
    else{
        let displayItem = document.createElement("p");
        displayItem.textContent = "No Orders";
        orderDisplay.appendChild(displayItem);
    }
};

let currentOrder = JSON.parse(history.getItem("currentOrder"));
let orders = JSON.parse(history.getItem("orders"));
updateDisplay();
form.addEventListener("submit",formSubmission);
