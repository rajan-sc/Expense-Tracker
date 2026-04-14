const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");

expenseForm.addEventListener("submit", addExpense);

window.addEventListener("DOMContentLoaded", () => {
    loadExpenses();
    checkPremiumStatus();
    getAIInsight();
    
    const limitSelect = document.getElementById("expense-limit");
    if (limitSelect) {
        limitSelect.value = currentLimit;
        limitSelect.addEventListener("change", (e) => {
            currentLimit = parseInt(e.target.value);
            localStorage.setItem("expenseLimit", currentLimit);
            loadExpenses(1);
        });
    }
});

async function getAIInsight() {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/expense/insights", {
            headers: { "Authorization": token }
        });
        document.getElementById("ai-insight").textContent = response.data.insight;
    } catch (error) {
        console.error("Failed to load AI insight", error);
        document.getElementById("ai-insight").textContent = "The AI advisor is offline.";
    }
}

let editExpenseId = null;
let currentPage = 1;
let currentLimit = parseInt(localStorage.getItem("expenseLimit")) || 5;

async function addExpense(e) {
    e.preventDefault();
    const submitBtn = document.getElementById("addExpense-btn");
    // preventing the btn click because of async nature of the function causing multiple requests.
    if(submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Processing...";
    }

    try {
        const amount = document.getElementById("amount").value;
        const description = document.getElementById("description").value;
        const token = localStorage.getItem("token");

        if(editExpenseId){
            const response = await axios.put(`http://localhost:3000/expense/edit-expense/${editExpenseId}`, {
                amount,
                description
            }, {
                headers: { "Authorization": token }
            });
            console.log(response.data);
            alert("Expense updated successfully");
            expenseForm.reset();
            loadExpenses();
            editExpenseId = null;
        }else{
            const response = await axios.post("http://localhost:3000/expense/add-expense",
                {
                    amount,
                    description
                },
                {
                    headers: { "Authorization": token }
                }
            );
            console.log(response.data);
            alert("Expense added successfully");
            expenseForm.reset();
            loadExpenses();
        }
    } catch(error){
        console.log(error);
        alert("Failed to add expense");
    } finally {
        if(submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Add Expense";
        }
    }
}

async function loadExpenses(page = currentPage) {
    currentPage = page;
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3000/expense/get-expenses?page=${page}&limit=${currentLimit}`, {
            headers: { "Authorization": token }
        });
        expenseList.innerHTML = "";
        
        const expenses = response.data.expenses || response.data;
        
        if(!expenses || expenses.length === 0){
            if (page > 1) {
                return loadExpenses(page - 1);
            }
            document.getElementById("expheading").textContent = "No expenses found";
            const paginationContainer = document.getElementById("pagination-container");
            if (paginationContainer) paginationContainer.innerHTML = "";
        } else {
            let totalAmount = response.data.totalAmount !== undefined ? response.data.totalAmount : expenses.reduce((acc, expense) => acc + expense.amount, 0);
            document.getElementById("expheading").textContent = `Expenses Total: ${totalAmount}`;
            expenses.forEach(expense => {
                showExpenseOnScreen(expense);
            });
            showPagination(response.data);
        }
    } catch (error) {
        console.log(error);
    }
}

function showPagination({ currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage }) {
    let paginationContainer = document.getElementById("pagination-container");
    if (!paginationContainer) {
        paginationContainer = document.createElement("div");
        paginationContainer.id = "pagination-container";
        paginationContainer.style.display = "flex";
        paginationContainer.style.gap = "5px";
        paginationContainer.style.marginTop = "10px";
        paginationContainer.style.alignItems = "center";
        expenseList.after(paginationContainer);
    }
    
    paginationContainer.innerHTML = "";
    
    if (hasPreviousPage) {
        const btn2 = document.createElement("button");
        btn2.innerHTML = previousPage;
        btn2.addEventListener("click", () => loadExpenses(previousPage));
        paginationContainer.appendChild(btn2);
    }
    
    const btn1 = document.createElement("button");
    btn1.innerHTML = `<h3>${currentPage}</h3>`;
    btn1.addEventListener("click", () => loadExpenses(currentPage));
    paginationContainer.appendChild(btn1);
    
    if (hasNextPage) {
        const btn3 = document.createElement("button");
        btn3.innerHTML = nextPage;
        btn3.addEventListener("click", () => loadExpenses(nextPage));
        paginationContainer.appendChild(btn3);
    }
}

function showExpenseOnScreen(expense) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = ` $ ${expense.amount} - ${expense.category} - ${expense.description} `;

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteExpense(expense.id);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editExpense(expense);

    li.appendChild(span);
    li.appendChild(delBtn);
    li.appendChild(editBtn);

    expenseList.appendChild(li);
}

async function deleteExpense(expenseId) {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`http://localhost:3000/expense/delete-expense/${expenseId}`, {
            headers: { "Authorization": token }
        });
        console.log(response.data);
        alert("Expense deleted successfully");
        loadExpenses();
    }
    catch(error){
        console.log(error);
        alert("Failed to delete expense");
    }
}

function editExpense(expense) {
    document.getElementById("amount").value = expense.amount;
    document.getElementById("description").value = expense.description;
    editExpenseId = expense.id;
    document.getElementById("addExpense-btn").textContent = "Update Expense";
}

const premiumBtn = document.createElement("button");
premiumBtn.textContent = "Buy Premium";

premiumBtn.style.position = "fixed";
premiumBtn.style.top = "20px";
premiumBtn.style.right = "20px";
premiumBtn.style.padding = "10px";
premiumBtn.style.backgroundColor = "gold";
premiumBtn.style.border = "none";
premiumBtn.style.cursor = "pointer";

document.body.appendChild(premiumBtn);

premiumBtn.addEventListener("click", () => {
    window.location.href = "/payment";
});


async function checkPremiumStatus() {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/user/me", {
            headers: { "Authorization": token }
        });

        if (response.data.isPremium) {
            // Hide the buy button
            premiumBtn.style.display = "none";

            // Add the premium status text
            const premiumMsg = document.createElement("p");
            premiumMsg.textContent = "You are a premium user";
            premiumMsg.style.position = "fixed";
            premiumMsg.style.top = "20px";
            premiumMsg.style.right = "20px";
            premiumMsg.style.margin = "0";
            premiumMsg.style.color = "gold";
            premiumMsg.style.fontWeight = "bold";
            document.body.appendChild(premiumMsg);

            // Add the leaderboard button
            const lbBtn = document.createElement("button");
            lbBtn.textContent = "Show Leaderboard";
            lbBtn.style.position = "fixed";
            lbBtn.style.top = "50px";
            lbBtn.style.right = "20px";
            lbBtn.style.padding = "10px";
            lbBtn.style.cursor = "pointer";
            lbBtn.addEventListener("click", leaderBoard);
            document.body.appendChild(lbBtn);
        }
    } catch (e) {
        console.error("Failed to fetch premium status:", e);
    }
}

async function leaderBoard(){
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/leaderboard", {
            headers: { "Authorization": token }
        });

        let lbContainer = document.getElementById("leaderboard-container");
        if (!lbContainer) {
            lbContainer = document.createElement("div");
            lbContainer.id = "leaderboard-container";
            lbContainer.style.marginTop = "30px";
            lbContainer.style.padding = "15px";
            lbContainer.style.border = "1px solid #ccc";
            document.body.appendChild(lbContainer);
        }

        lbContainer.innerHTML = "<h3>Leaderboard</h3><ul>" +
            response.data.map(user => `<li>Name: ${user.name} - Total Expense: $${user.totalExpense || 0}</li>`).join("") +
            "</ul>";

    } catch (error) {
        console.error(error);
        alert("Failed to load leaderboard");
    }
}
