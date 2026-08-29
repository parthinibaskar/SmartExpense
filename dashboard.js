//CHECK LOGIN 
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
    document.getElementById("userName").textContent = user.name;
    document.getElementById("welcomeName").textContent = user.name.split(" ")[0];
    document.getElementById("greetingWord").textContent = timeOfDayGreeting();
    const avatarEl = document.getElementById("userAvatar");
    avatarEl.textContent = user.name.charAt(0).toUpperCase();
    avatarEl.style.background = avatarGradientFor(user.name);
}
// Default the date input to today, so people don't have to pick it every time.
const dateInput = document.getElementById("date");
if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().split("T")[0];
}
//TRANSACTIONS
function getTransactions() {

    return JSON.parse(
        localStorage.getItem(
            "smartExpenseTransactions_" + currentUser
        ) || "[]"
    );
}
function saveTransactions(data) {
    localStorage.setItem(
        "smartExpenseTransactions_" + currentUser,
        JSON.stringify(data)
    );
}
// UPDATE DASHBOARD 
function updateDashboard() {
    const transactions = getTransactions();
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
        if (t.type === "income") {
            income += Number(t.amount);
        } else {
            expense += Number(t.amount);
        }
    });
    document.getElementById("totalIncome").textContent = formatINR(income);
    document.getElementById("totalExpense").textContent = formatINR(expense);
    document.getElementById("totalBalance").textContent = formatINR(income - expense);
    document.getElementById("transactionCount").textContent = transactions.length;
    // Recent transactions
    const list =
        document.getElementById("recentTransactions");
    if (!transactions.length) {
        list.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                <strong>No transactions yet</strong>
                <span>Add your first one using the form</span>
            </div>
        `;
        return;
    }
    list.innerHTML = transactions
        .slice(-5)
        .reverse()
        .map(t => `
            <div class="recent-item">
                <div class="recent-icon ${t.type}">
                    ${t.type === "income" ? "+" : "−"}
                </div>
                <div class="recent-main">
                    <strong>${t.description}</strong>
                    <small>${t.category} • ${t.date}</small>
                </div>
                <span class="amount ${t.type}">
                    ${t.type === "income" ? "+" : "-"}${formatINR(t.amount)}
                </span>
            </div>
        `)
        .join("");
}
// ADD TRANSACTION 
const transactionForm =document.getElementById("transactionForm");
if (transactionForm) {
    transactionForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const type =
            document.querySelector(
                'input[name="type"]:checked'
            ).value;
        const amount =
            document.getElementById("amount").value;
        const category =
            document.getElementById("category").value;
        const description =
            document.getElementById("description").value;
        const date =
            document.getElementById("date").value;
        if (Number(amount) <= 0) {
            showToast("Enter an amount greater than zero.", "error");
            return;
        }
        const transactions = getTransactions();
        transactions.push({
            id: Date.now(),
            type,
            amount,
            category,
            description,
            date
        });
        saveTransactions(transactions);
        transactionForm.reset();
        dateInput.value = new Date().toISOString().split("T")[0];
        updateDashboard();
        showToast(
            (type === "income" ? "Income" : "Expense") + " added — " + formatINR(amount),
            "success"
        );
    });
}
updateDashboard();
