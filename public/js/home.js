window.addEventListener("DOMContentLoaded", loadExpenses);

const expenseForm = document.getElementById("expense-form");
const addBtn = document.getElementById("add-btn");
const expenseList = document.getElementById("expense-list");

let isEditing = false;
let editId = null;

async function loadExpenses() {
    try {
        const res = await axios.get("/expense/expenses");
        expenseList.innerHTML = "";
        res.data.forEach(expense => {
            addToUI(expense);
        });
    } catch (err) {
        console.log(err);
    }
}

function addToUI(expense) {
    const li = document.createElement("li");
    li.id = `expense-${expense.id}`;
    li.textContent = `${expense.amount} - ${expense.description} - ${expense.category} `;

    const edtBtn = document.createElement("button");
    edtBtn.textContent = "Edit";
    edtBtn.onclick = () => editExpense(expense);
    li.appendChild(edtBtn);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteExpense(expense.id);
    li.appendChild(delBtn);

    expenseList.appendChild(li);
}

expenseForm.onsubmit = async (e) => {
    e.preventDefault();
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;

    try {
        if (isEditing) {
            await axios.put("/expense/update-expense", { id: editId, amount, description, category });
            isEditing = false;
            editId = null;
            addBtn.textContent = "Add Expense";
        } else {
            await axios.post("/expense/add-expense", { amount, description, category });
        }
        expenseForm.reset();
        loadExpenses(); // Refresh list
    } catch (err) {
        console.log(err);
    }
};

function editExpense(expense) {
    document.getElementById("amount").value = expense.amount;
    document.getElementById("description").value = expense.description;
    document.getElementById("category").value = expense.category;

    isEditing = true;
    editId = expense.id;
    addBtn.textContent = "Update Expense";
}

async function deleteExpense(id) {
    try {
        await axios.delete("/expense/delete-expense", { data: { id } });
        const element = document.getElementById(`expense-${id}`);
        if (element) element.remove();
    } catch (error) {
        console.log(error);
    }
}


