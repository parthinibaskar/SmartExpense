//login check
const currentUser =
    localStorage.getItem("smartExpenseCurrentUser");
if (!currentUser) {
    window.location.href = "login.html";
}
// USER DETAILS
const users = JSON.parse(
    localStorage.getItem("smartExpenseUsers") || "[]"
);
const user = users.find(
    u => u.email === currentUser
);
if (user) {
    const nameEl =
        document.getElementById("userName");
    const avatarEl =
        document.getElementById("userAvatar");
    if (nameEl) {
        nameEl.textContent = user.name;
    }
    if (avatarEl) {
        avatarEl.textContent =
            user.name.charAt(0).toUpperCase();
        if (typeof avatarGradientFor === "function") {
            avatarEl.style.background =
                avatarGradientFor(user.name);
        }
    }
}
// GET TRANSACTIONS
const transactions = JSON.parse(
    localStorage.getItem(
        "smartExpenseTransactions_" + currentUser
    ) || "[]"
);
// CALCULATE TOTALS
let income = 0;
let expense = 0;
transactions.forEach(transaction => {
    const amount =
        Number(transaction.amount) || 0;
    if (transaction.type === "income") {
        income += amount;
    } else if (transaction.type === "expense") {
        expense += amount;
    }
});
// DISPLAY TOTALS
const incomeEl =
    document.getElementById("analyticsIncome");
const expenseEl =
    document.getElementById("analyticsExpense");
if (incomeEl) {
    incomeEl.textContent = formatINR(income);
}
if (expenseEl) {
    expenseEl.textContent = formatINR(expense);
}

// INCOME / EXPENSE BARS
const incomeBar = document.getElementById("incomeBar");
const expenseBar = document.getElementById("expenseBar");
const total = income + expense;
if (total > 0) {
    incomeBar.style.width = (income / total * 100) + "%";
    expenseBar.style.width =(expense / total * 100) + "%";
} else {
    incomeBar.style.width = "0%";
    expenseBar.style.width = "0%";
}
// SAVINGS RATE
const savingsEl =document.getElementById("savingsRate");
if (income > 0) {
    const savingsRate = ((income - expense) / income) * 100;
    const rounded = Math.round(savingsRate);
    if (rounded >= 0) {
        savingsEl.innerHTML = `You're saving <strong>${rounded}%</strong> of your income.`;
    } else {
        savingsEl.innerHTML = `You've spent <strong>${Math.abs(rounded)}%</strong> more than you earned.`;
    }
} else {
    savingsEl.textContent = "Add some income to see your savings rate.";
}
// CATEGORY DATA
const categories = {};
transactions
    .filter(t => t.type === "expense")
    .forEach(t => {
        const category =
            t.category || "Other";
        const amount =
            Number(t.amount) || 0;
        categories[category] =
            (categories[category] || 0) + amount;
    });
const sortedCategories =
    Object.entries(categories)
        .sort((a, b) => b[1] - a[1]);
// TOP CATEGORY
const topCategory = document.getElementById("topCategory");
const categoryBar = document.getElementById("categoryBar");
if (sortedCategories.length > 0) {
    const [category, amount] = sortedCategories[0];
    topCategory.textContent = category + " — " + formatINR(amount);
    const maxAmount = sortedCategories[0][1];
    categoryBar.style.width = (amount / maxAmount * 100) + "%";
} else {
    topCategory.textContent = "No data available";
    categoryBar.style.width = "0%";
}
// FULL CATEGORY BREAKDOWN
const breakdown = document.getElementById("fullBreakdown");
if (!sortedCategories.length) {
    breakdown.innerHTML = `
        <div class="empty-state">
            <strong>No expenses yet</strong>
            <span>
                Category breakdown will appear
                once you add some expenses.
            </span>
        </div>
    `;
} else {
    const maxAmount =
        sortedCategories[0][1];
    breakdown.innerHTML =
        sortedCategories
            .map(([category, amount]) => {
                const percentage =
                    expense > 0
                        ? Math.round(
                            (amount / expense) * 100
                        )
                        : 0;
                const width =
                    (amount / maxAmount) * 100;
                return `
                    <div class="category-row">
                        <div class="category-row-top">
                            <strong>
                                ${category}
                            </strong>
                            <span>
                                ${formatINR(amount)}
                                • ${percentage}%
                            </span>
                        </div>
                        <div class="category-track">
                            <div
                                class="category-track-fill"
                                style="width:${width}%">
                            </div>
                        </div>
                    </div>
                `;
            })
            .join("");
}
// LOGOUT
const logoutBtn =
    document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener(
        "click",
        function () {
            localStorage.removeItem(
                "smartExpenseCurrentUser"
            );
            window.location.href =
                "login.html";
        }
    );
}