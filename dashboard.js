const currentUser = localStorage.getItem("smartExpenseCurrentUser");

if (!currentUser) {
    window.location.href = "login.html";
}

const users = JSON.parse(localStorage.getItem("smartExpenseUsers") || "[]");
const user = users.find(u => u.email === currentUser);

if (user) {
    document.getElementById("userName").textContent = user.name;
    document.getElementById("welcomeName").textContent = user.name.split(" ")[0];
    document.getElementById("greetingWord").textContent = timeOfDayGreeting();

    const avatar = document.getElementById("userAvatar");
    avatar.textContent = user.name.charAt(0).toUpperCase();
    avatar.style.background = avatarGradientFor(user.name);
}

const dateInput = document.getElementById("date");

if (dateInput) {
    dateInput.value = new Date().toISOString().split("T")[0];
}

function getTransactions() {
    return JSON.parse(
        localStorage.getItem("smartExpenseTransactions_" + currentUser) || "[]"
    );
}

function saveTransactions(data) {
    localStorage.setItem(
        "smartExpenseTransactions_" + currentUser,
        JSON.stringify(data)
    );
}

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

    const list = document.getElementById("recentTransactions");

    if (!transactions.length) {
        list.innerHTML = `
            <div class="empty-state">
                <strong>No transactions yet</strong>
                <span>Add your first one using the form</span>
            </div>
        `;
        return;
    }

    list.innerHTML = transactions.slice(-5).reverse().map(t => `
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
    `).join("");
}

const transactionForm = document.getElementById("transactionForm");

if (transactionForm) {

    transactionForm.addEventListener("submit", function(e) {

        e.preventDefault();

        const type = document.querySelector(
            'input[name="type"]:checked'
        ).value;

        const amount = document.getElementById("amount").value;
        const category = document.getElementById("category").value;
        const description = document.getElementById("description").value.trim();
        const date = document.getElementById("date").value;

        if (Number(amount) <= 0) {
            alert("Enter a valid amount");
            return;
        }

        const transactions = getTransactions();

        transactions.push({
            id: Date.now(),
            type: type,
            amount: Number(amount),
            category: category,
            description: description,
            date: date
        });

        saveTransactions(transactions);

        transactionForm.reset();

        dateInput.value = new Date().toISOString().split("T")[0];

        updateDashboard();
    });
}

updateDashboard();