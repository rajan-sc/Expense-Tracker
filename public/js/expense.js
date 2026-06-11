const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");

expenseForm.addEventListener("submit", addExpense);

window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login";
        return;
    }
    loadExpenses();
    checkPremiumStatus();

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
        const response = await axios.get("/expense/insights", {
            headers: { "Authorization": token }
        });
        document.getElementById("ai-insight").textContent = response.data.insight;
    } catch (error) {
        console.error("Failed to load AI insight", error);
        document.getElementById("ai-insight").textContent = error.response?.data?.insight || "The AI advisor is offline.";
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
        const notes = document.getElementById("notes").value;
        const token = localStorage.getItem("token");

        if(editExpenseId){
            const response = await axios.put(`/expense/edit-expense/${editExpenseId}`, {
                amount,
                description,
                notes
            }, {
                headers: { "Authorization": token }
            });
            console.log(response.data);
            alert("Expense updated successfully");
            expenseForm.reset();
            loadExpenses();
            editExpenseId = null;
        }else{
            const response = await axios.post("/expense/add-expense",
                {
                    amount,
                    description,
                    notes
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
        const response = await axios.get(`/expense/get-expenses?page=${page}&limit=${currentLimit}`, {
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
        btn2.className = "btn btn-secondary btn-sm";
        btn2.innerHTML = previousPage;
        btn2.addEventListener("click", () => loadExpenses(previousPage));
        paginationContainer.appendChild(btn2);
    }

    const btn1 = document.createElement("button");
    btn1.className = "btn btn-primary btn-sm";
    btn1.style.margin = "0"; // prevent margin-top from primary class
    btn1.innerHTML = currentPage;
    btn1.addEventListener("click", () => loadExpenses(currentPage));
    paginationContainer.appendChild(btn1);

    if (hasNextPage) {
        const btn3 = document.createElement("button");
        btn3.className = "btn btn-secondary btn-sm";
        btn3.innerHTML = nextPage;
        btn3.addEventListener("click", () => loadExpenses(nextPage));
        paginationContainer.appendChild(btn3);
    }
}

function showExpenseOnScreen(expense) {
    const li = document.createElement("li");

    const infoDiv = document.createElement("div");
    infoDiv.className = "expense-info";
    
    const amountSpan = document.createElement("span");
    amountSpan.className = "expense-amount";
    amountSpan.textContent = `$${expense.amount} `;
    
    const notesText = expense.notes ? ` (Note: ${expense.notes})` : ""; 
    const detailSpan = document.createElement("span");
    detailSpan.textContent = `- ${expense.category} - ${expense.description}${notesText}`;

    infoDiv.appendChild(amountSpan);
    infoDiv.appendChild(detailSpan);

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "expense-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-secondary btn-sm";
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editExpense(expense);

    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-danger btn-sm";
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteExpense(expense.id);

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(delBtn);

    li.appendChild(infoDiv);
    li.appendChild(actionsDiv);

    expenseList.appendChild(li);
}

async function deleteExpense(expenseId) {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`/expense/delete-expense/${expenseId}`, {
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
    document.getElementById("notes").value = expense.notes || "";
    editExpenseId = expense.id;
    document.getElementById("addExpense-btn").textContent = "Update Expense";
}

const widgetsContainer = document.getElementById("floating-widgets");

const premiumBtn = document.createElement("button");
premiumBtn.className = "btn btn-premium";
premiumBtn.textContent = "Upgrade to Premium ✨";
premiumBtn.addEventListener("click", () => {
    window.location.href = "/payment";
});
if(widgetsContainer) widgetsContainer.appendChild(premiumBtn);

async function checkPremiumStatus() {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/user/me", {
            headers: { "Authorization": token }
        });

        if (response.data.isPremium) {
            premiumBtn.style.display = "none";

            const premiumMsg = document.createElement("p");
            premiumMsg.className = "premium-text";
            premiumMsg.textContent = "👑 Premium User";

            const lbBtn = document.createElement("button");
            lbBtn.className = "btn btn-primary btn-sm";
            lbBtn.textContent = "Leaderboard";
            lbBtn.addEventListener("click", leaderBoard);

            const dlBtn = document.createElement("button");
            dlBtn.className = "btn btn-secondary btn-sm";
            dlBtn.textContent = "Download Data";
            dlBtn.addEventListener("click", downloadExpenses);

            const histBtn = document.createElement("button");
            histBtn.className = "btn btn-secondary btn-sm";
            histBtn.textContent = "Show History";
            histBtn.addEventListener("click", showDownloadHistory);
            
            if(widgetsContainer) {
                widgetsContainer.appendChild(premiumMsg);
                widgetsContainer.appendChild(lbBtn);
                widgetsContainer.appendChild(dlBtn);
                widgetsContainer.appendChild(histBtn);
            }

            getAIInsight();
        } else {
            document.getElementById("ai-insight").textContent = "AI Advisor is a premium feature. Upgrade to buy premium!";
        }
    } catch (e) {
        console.error("Failed to fetch premium status:", e);
    }
}

async function leaderBoard(){
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/leaderboard", {
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

async function downloadExpenses() {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/expense/download", {
            headers: { "Authorization": token }
        });
        if (response.status === 200) {
            const a = document.createElement("a");
            a.href = response.data.fileUrl;
            a.download = "expenses.txt";
            a.click();
        }
    }catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Failed to download expenses");
    }
}

async function showDownloadHistory() {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/expense/download-history", {
            headers: { "Authorization": token }
        });

        let historyContainer = document.getElementById("history-container");
        if (!historyContainer) {
            historyContainer = document.createElement("div");
            historyContainer.id = "history-container";
            historyContainer.style.marginTop = "30px";
            historyContainer.style.padding = "15px";
            historyContainer.style.border = "1px solid #ccc";
            document.body.appendChild(historyContainer);
        }

        if (response.data.history.length === 0) {
            historyContainer.innerHTML = "<h3>Download History</h3><p>No downloads yet.</p>";
            return;
        }

        historyContainer.innerHTML = "<h3>Download History</h3><ul>" +
            response.data.history.map(item => `<li>${new Date(item.createdAt).toLocaleString()} - <a href="${item.fileUrl}" target="_blank">Download File</a></li>`).join("") +
            "</ul>";

    } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Failed to load download history");
    }
}
