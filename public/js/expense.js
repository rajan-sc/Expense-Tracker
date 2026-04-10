const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");

expenseForm.addEventListener("submit", addExpense);

window.addEventListener("DOMContentLoaded", () => {
    loadExpenses();
    checkPremiumStatus();
});

let editExpenseId = null;

async function addExpense(e) {
    try {
        e.preventDefault();
        const amount = document.getElementById("amount").value;
        const description = document.getElementById("description").value;
        const category = document.getElementById("category").value;
        const token = localStorage.getItem("token");

        if(editExpenseId){
            const response = await axios.put(`http://localhost:3000/user/expense/edit-expense/${editExpenseId}`, {
                amount,
                category,
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
        const response = await axios.post("http://localhost:3000/user/expense/add-expense",
             {
                amount,
                category,
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
}
    catch(error){
        console.log(error);
        alert("Failed to add expense");
    }
}

async function loadExpenses() {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3000/user/expense/get-expenses`, {
            headers: { "Authorization": token }
        });
        expenseList.innerHTML = "";
        if(response.data.length === 0){
            document.getElementById("expheading").textContent = "No expenses found";
        } else {
            let total = response.data.reduce((acc, expense) => acc + expense.amount, 0);
            document.getElementById("expheading").textContent = `Expenses Total: ${total}`;
            response.data.forEach(expense => {
                showExpenseOnScreen(expense);
            });
        }
    } catch (error) {
        console.log(error);
    }
}

function showExpenseOnScreen(expense) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = ` $ ${expense.amount} - ${expense.category} - ${expense.description}`;

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
        const response = await axios.delete(`http://localhost:3000/user/expense/delete-expense/${expenseId}`, {
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
    document.getElementById("category").value = expense.category;
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
        const response = await axios.get("http://localhost:3000/user/expense/leaderboard", {
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
            response.data.map(user => `<li>Name: ${user.name} - Total Expense: $${user.totalAmount || 0}</li>`).join("") +
            "</ul>";
            
    } catch (error) {
        console.error(error);
        alert("Failed to load leaderboard");
    }
}
