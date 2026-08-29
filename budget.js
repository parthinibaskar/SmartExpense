// LOGIN CHECK 
const budgetUser =localStorage.getItem("smartExpenseCurrentUser");
if (!budgetUser) {
    window.location.href = "login.html";
}
//NAVBAR USER INFO 
const budgetUsers = JSON.parse(
    localStorage.getItem("smartExpenseUsers") || "[]"
);
const budgetProfile = budgetUsers.find(u => u.email === budgetUser);
if (budgetProfile) {
    const nameEl = document.getElementById("userName");
    const avatarEl = document.getElementById("userAvatar");
    if (nameEl) nameEl.textContent = budgetProfile.name;
    if (avatarEl) {
        avatarEl.textContent = budgetProfile.name.charAt(0).toUpperCase();
        avatarEl.style.background = avatarGradientFor(budgetProfile.name);
    }
}
//GET EXPENSES 
function getExpenses() {
    return JSON.parse(
        localStorage.getItem(
            "smartExpenseTransactions_" + budgetUser
        ) || "[]"
    );
}
//UPDATE BUDGET 
function updateBudget() {
    const budget = Number(
        localStorage.getItem(
            "smartExpenseBudget_" + budgetUser
        ) || 0
    );
    const transactions = getExpenses();
    const expenseTransactions = transactions.filter(t => t.type === "expense");
    const spent = expenseTransactions
        .reduce((sum, t) => sum + Number(t.amount), 0);
    const remaining = budget - spent;
    document.getElementById("budgetAmount").textContent = formatINR(budget);
    document.getElementById("budgetSpent").textContent = formatINR(spent);
    document.getElementById("budgetRemaining").textContent = formatINR(Math.max(remaining, 0));
    let percentage = budget
        ? (spent / budget) * 100
        : 0;
    percentage = Math.min(percentage, 100);
    const progressBar = document.getElementById("budgetProgress");
    progressBar.style.width = percentage + "%";
    progressBar.className = "progress-bar";
    const message = document.getElementById("budgetMessage");
    message.className = "";
    if (budget === 0) {
        message.textContent = "Set your monthly budget to start.";
    } else if (spent > budget) {
        message.textContent = "⚠️ Budget exceeded by " + formatINR(spent - budget) + ".";
        message.className = "danger";
        progressBar.className = "progress-bar danger";
    } else if (percentage >= 80) {
        message.textContent = "⚠️ You've used " + Math.round(percentage) + "% of your budget.";
        message.className = "warning";
        progressBar.className = "progress-bar warning";
    } else {
        message.textContent = "✓ You're within your budget.";
        message.className = "ok";
    }
    //CATEGORY BREAKDOWN 
    const categoryTotals = {};
    expenseTransactions.forEach(t => {
        categoryTotals[t.category] =
            (categoryTotals[t.category] || 0) + Number(t.amount);
    });
    const breakdownEl = document.getElementById("categoryBreakdown");
    const entries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    if (!entries.length) {
        breakdownEl.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                <strong>No expenses recorded yet</strong>
                <span>Add transactions to see the breakdown here</span>
            </div>
        `;
        return;
    }
    const maxAmount = entries[0][1];
    breakdownEl.innerHTML = entries.map(([category, amount]) => `
        <div class="category-row">
            <div class="category-row-top">
                <strong>${category}</strong>
                <span>${formatINR(amount)}</span>
            </div>
            <div class="category-track">
                <div class="category-fill" style="width:${(amount / maxAmount) * 100}%"></div>
            </div>
        </div>
    `).join("");
}
//SAVE BUDGET 
const saveBudget =
    document.getElementById("saveBudget")
if (saveBudget) {
    saveBudget.addEventListener("click", function() {
        const amount = Number(document.getElementById("budgetInput").value);
        if (amount <= 0) {
            showToast("Enter a valid budget amount.", "error");
            return;
        }
        localStorage.setItem( 
            "smartExpenseBudget_" + budgetUser,amount
        );
        document.getElementById("budgetInput").value = "";
        updateBudget();
        showToast("Monthly budget set to " + formatINR(amount) + ".", "success");
    });
}
updateBudget();
