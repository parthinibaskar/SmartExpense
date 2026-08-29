function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
}
function initThemeToggle() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
        const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
        const next = current === "dark" ? "light" : "dark";
        applyTheme(next);
        localStorage.setItem("smartExpenseTheme", next);
    });
}
document.addEventListener("DOMContentLoaded", initThemeToggle);
// TOASTS 
function ensureToastStack() {
    let stack = document.getElementById("toastStack");
    if (!stack) {
        stack = document.createElement("div");
        stack.id = "toastStack";
        document.body.appendChild(stack);
    }
    return stack;
}
const TOAST_ICONS = {
    success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
    info: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
};
function showToast(message, type) {
    type = type || "info";
    const stack = ensureToastStack();
    const toast = document.createElement("div");
    toast.className = "toast " + type;
    toast.innerHTML = (TOAST_ICONS[type] || TOAST_ICONS.info) + "<span>" + message + "</span>";

    stack.appendChild(toast);

    setTimeout(function () {
        toast.classList.add("leaving");
        setTimeout(function () {
            toast.remove();
        }, 200);
    }, 3200);
}
const AVATAR_GRADIENTS = [
    ["#2563eb", "#7c3aed"],
    ["#0891b2", "#2563eb"],
    ["#059669", "#0891b2"],
    ["#d97706", "#e11d48"],
    ["#7c3aed", "#e11d48"],
    ["#059669", "#2563eb"]
];
function avatarGradientFor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
    }
    const pair = AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
    return "linear-gradient(135deg," + pair[0] + "," + pair[1] + ")";
}
//GREETING 
function timeOfDayGreeting() {
    const hour = new Date().getHours();
    if (hour < 5) return "Burning the midnight oil";
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good evening";
}
//CURRENCY 
function formatINR(amount) {
    const n = Number(amount) || 0;
    return "₹" + n.toLocaleString("en-IN");
}
