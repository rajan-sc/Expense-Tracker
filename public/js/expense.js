const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");

expenseForm.addEventListener("submit", addExpense);

window.addEventListener("DOMContentLoaded", () => {
    loadExpenses();
});

async function addExpense(e) {
    try {
        e.preventDefault();
        const amount = document.getElementById("amount").value;
        const description = document.getElementById("description").value;
        const category = document.getElementById("category").value;
        const token = localStorage.getItem("token");
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
        expenseList.innerHTML = "<h3>Expenses</h3>";
        response.data.forEach(expense => {
            showExpenseOnScreen(expense);
        });
    } catch (error) {
        console.log(error);
    }
}

function showExpenseOnScreen(expense) {
    const li = document.createElement("li");
    li.textContent = `${expense.amount} - ${expense.category} - ${expense.description}`;
    expenseList.appendChild(li);
}







