// SIGNUP 
const signupForm = document.getElementById("signupForm")
if (signupForm) {
    signupForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim().toLowerCase();
        const password = document.getElementById("signupPassword").value;
        const confirm = document.getElementById("confirmPassword").value;
        const message = document.getElementById("signupMessage");
        if (password.length < 8) {
            message.textContent = "Password must be at least 8 characters.";
            message.className = "error";
            return;
        }
        if (password !== confirm) {
            message.textContent = "Passwords do not match.";
            message.className = "error";
            return;
        }
        const users = JSON.parse(
            localStorage.getItem("smartExpenseUsers") || "[]"
        );
        const exists = users.find(user => user.email === email);
        if (exists) {
            message.textContent = "Account already exists. Please login.";
            message.className = "error";
            return;
        }
        users.push({
            name: name,
            email: email,
            password: password
        });
        localStorage.setItem(
            "smartExpenseUsers",
            JSON.stringify(users)
        );
        message.textContent = "Account created successfully! Redirecting to login...";
        message.className = "success";
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    });
}
//LOGIN 
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const email = document
            .getElementById("loginEmail")
            .value.trim()
            .toLowerCase();
        const password =
            document.getElementById("loginPassword").value;
        const message =
            document.getElementById("loginMessage");
        const users = JSON.parse(
            localStorage.getItem("smartExpenseUsers") || "[]"
        );
        const user = users.find(
            u => u.email === email && u.password === password
        );
        if (!user) {
            message.textContent = "Invalid email or password.";
            message.className = "error";
            return;
        }
        localStorage.setItem(
            "smartExpenseCurrentUser",
            email
        );

        window.location.href = "dashboard.html";
    });
}
//LOGOUT 
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {

        localStorage.removeItem("smartExpenseCurrentUser");

        window.location.href = "login.html";
    });
}
