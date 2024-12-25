let budget = 0;
let total = 0;
const products = [];

document.querySelector('#push').onclick = function () {
    const budgetInput = parseFloat(document.querySelector(".user-budget input").value);
    if (isNaN(budgetInput) || budgetInput <= 0) {
        alert("Please enter a valid number for the budget.");
    } else {
        budget = budgetInput;
        total = 0;
        report();
        document.querySelector(".user-budget input").value = "";
    }
};

document.querySelector('#productName').onclick = function () {
    const productNameInput = document.querySelector(".user-amount-container input[type='text']");
    const costInput = document.querySelector(".user-amount-container input[type='number']");
    const productName = productNameInput.value.trim();
    const cost = parseFloat(costInput.value);

    if (productName === "") {
        alert("Please enter a product name.");
    } else if (isNaN(cost) || cost <= 0) {
        alert("Please enter a valid cost greater than 0.");
    } else if (total + cost > budget) {
        alert("Total expense cannot exceed the budget.");
    } else {
        products.push({ name: productName, cost });
        total += cost;
        report();
        renderProduct();
        productNameInput.value = "";
        costInput.value = "";
    }
};

function renderProduct() {
    const taskContainer = document.querySelector('#tasks');
    taskContainer.innerHTML = "";
    products.forEach((product, index) => {
        const taskElement = document.createElement("div");
        taskElement.classList.add("list");
        taskElement.innerHTML = `
            <span id="taskname">${product.name} - $${product.cost.toFixed(2)}</span>
            <button class="edit" data-index="${index}">✏️</button>
            <button class="delete" data-index="${index}">🗑</button>
        `;
        taskContainer.appendChild(taskElement);
    });

   
    document.querySelectorAll('.edit').forEach(button => {
        button.addEventListener('click', editProduct);
    });
    document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', deleteProduct);
    });
}

function editProduct(event) {
    const index = event.target.dataset.index;
    const product = products[index];
    const newCost = parseFloat(prompt(`Set new price for "${product.name}" (Current price: $${product.cost}):`, product.cost));

    if (!isNaN(newCost) && newCost > 0) {
        const totalCostWithoutCurrent = total - product.cost;
        if (totalCostWithoutCurrent + newCost > budget) {
            alert("Total expense cannot be higher than the budget.");
        } else {
            total = totalCostWithoutCurrent + newCost;
            products[index].cost = newCost;
            renderProduct();
            report();
        }
    } else {
        alert("Please enter a valid price!");
    }
}

function deleteProduct(event) {
    const index = event.target.dataset.index;
    const product = products[index];
    total -= product.cost;
    products.splice(index, 1);
    renderProduct();
    report();
}

function report() {
    const balance = budget - total;
    document.querySelector('#report').innerHTML = `
        <div class="balance">
            <h2>Total: $${budget.toFixed(2)} | Expense: $${total.toFixed(2)} | Balance: $${balance.toFixed(2)}</h2>
        </div>`;
}
