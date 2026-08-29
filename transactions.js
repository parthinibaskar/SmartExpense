// LOGIN CHECK 
const transactionUser =
    localStorage.getItem("smartExpenseCurrentUser");

if (!transactionUser) {
    window.location.href = "login.html";
}
//NAVBAR USER INFO 
const txUsers = JSON.parse(
    localStorage.getItem("smartExpenseUsers") || "[]"
);
const txProfile = txUsers.find(u => u.email === transactionUser);
if (txProfile) {
    const nameEl = document.getElementById("userName");
    const avatarEl = document.getElementById("userAvatar");

    if (nameEl) nameEl.textContent = txProfile.name;

    if (avatarEl) {
        avatarEl.textContent = txProfile.name.charAt(0).toUpperCase();
        avatarEl.style.background = avatarGradientFor(txProfile.name);
    }
}
// DATA 
function getData() {
    return JSON.parse(
        localStorage.getItem(
            "smartExpenseTransactions_" + transactionUser
        ) || "[]"
    );
}
function saveData(data) {

    localStorage.setItem(
        "smartExpenseTransactions_" + transactionUser,
        JSON.stringify(data)
    );
}
//DISPLAY 
function showTransactions() {
    const search =document.getElementById("searchInput")
            .value.toLowerCase();
    const type =document.getElementById("typeFilter").value;
    const category =document.getElementById("categoryFilter").value;
    const data = getData();
    const filtered = data
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .filter(t => {
            const matchSearch = t.description.toLowerCase().includes(search);
            const matchType =type === "all" || t.type === type;
            const matchCategory =category === "all" || t.category === category;
            return matchSearch &&
                   matchType &&
                   matchCategory;
        });
    const table =document.getElementById("transactionTable");
    if (!filtered.length) {

        table.innerHTML = `
            <tr class="empty-row">
                <td colspan="6">
                    <div class="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                        <strong>No transactions found</strong>
                        <span>Try a different search or filter</span>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    table.innerHTML = filtered.map(t => `
        <tr>
            <td>${t.date}</td>
            <td>${t.description}</td>
            <td>${t.category}</td>
            <td><span class="type-pill ${t.type}">${t.type}</span></td>
            <td class="${t.type}">
                ${t.type === "income" ? "+" : "-"}${formatINR(t.amount)}
            </td>
            <td>
                <button
                    class="delete"
                    onclick="deleteTransaction(${t.id})"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Delete
                </button>
            </td>

        </tr>
    `).join("");
}
// DELETE 
function deleteTransaction(id) {
    if (!confirm("Delete this transaction?")) {
        return;
    }
    const data = getData();
    const updated =
        data.filter(t => t.id !== id);
    saveData(updated);
    showTransactions();
    showToast("Transaction deleted.", "success");
}
//EXPORT CSV
function exportCsv() {
    const data = getData();
    if (!data.length) {
        showToast("No transactions to export yet.", "error");
        return;
    }
    const header = ["Date", "Description", "Category", "Type", "Amount"];
    const rows = data
        .slice()
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(t => [
            t.date,
            `"${String(t.description).replace(/"/g, '""')}"`,
            t.category,
            t.type,
            t.amount
        ].join(","));
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "smartexpense-transactions-" + new Date().toISOString().split("T")[0] + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("Transactions exported to CSV.", "success");
}
const exportBtn = document.getElementById("exportCsv");
if (exportBtn) {
    exportBtn.addEventListener("click", exportCsv);
}
//FILTER EVENTS
document.getElementById("searchInput")
    .addEventListener("input", showTransactions);

document.getElementById("typeFilter")
    .addEventListener("change", showTransactions);

document.getElementById("categoryFilter")
    .addEventListener("change", showTransactions);
showTransactions();
