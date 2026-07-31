// ==============================================
// login.js
// Military Directory System
// Version 3.1
// ==============================================

"use strict";

// ==============================================
// Initial
// ==============================================

document.addEventListener("DOMContentLoaded", () => {

    checkAlreadyLogin();

    const form = document.getElementById("loginForm");

    if (form) {
        form.addEventListener("submit", loginSubmit);
    }

});

// ==============================================
// Login แล้วหรือยัง
// ==============================================

async function checkAlreadyLogin() {

    try {

        const session = await getSession();

        if (session) {

            window.location.replace("dashboard.html");

        }

    }

    catch (err) {

        console.error(err);

    }

}

// ==============================================
// Login
// ==============================================

async function loginSubmit(event) {

    event.preventDefault();

    clearMessage();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // ----------------------------
    // Validation
    // ----------------------------

    if (!email) {

        showMessage("กรุณากรอกอีเมล");

        emailInput.focus();

        return;

    }

    if (!password) {

        showMessage("กรุณากรอกรหัสผ่าน");

        passwordInput.focus();

        return;

    }

    if (!emailInput.checkValidity()) {

        showMessage("รูปแบบอีเมลไม่ถูกต้อง");

        emailInput.focus();

        return;

    }

    setLoading(true);

    try {

        const {

            data,

            error

        } = await supabase.auth.signInWithPassword({

            email,
            password

        });

        if (error) {

            throw error;

        }

        if (!data.user) {

            throw new Error("ไม่พบข้อมูลผู้ใช้งาน");

        }

        window.location.replace("dashboard.html");

    }

    catch (err) {

        console.error(err);

        switch (err.message) {

            case "Invalid login credentials":

                showMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง");

                break;

            case "Email not confirmed":

                showMessage("กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ");

                break;

            default:

                showMessage(err.message);

        }

    }

    finally {

        setLoading(false);

    }

}

// ==============================================
// Loading
// ==============================================

function setLoading(status) {

    const btn = document.getElementById("loginBtn");
    const text = document.getElementById("btnText");
    const spinner = document.getElementById("btnLoading");

    if (!btn) return;

    btn.disabled = status;

    if (text) {

        text.classList.toggle("d-none", status);

    }

    if (spinner) {

        spinner.classList.toggle("d-none", !status);

    }

}

// ==============================================
// Alert Message
// ==============================================

function showMessage(message, type = "danger") {

    const msg = document.getElementById("msg");

    if (!msg) {

        alert(message);

        return;

    }

    msg.className = `alert alert-${type} mt-3`;

    msg.textContent = message;

    msg.classList.remove("d-none");

}

function clearMessage() {

    const msg = document.getElementById("msg");

    if (!msg) return;

    msg.classList.add("d-none");

    msg.textContent = "";

}

// ==============================================
// Password Toggle
// ==============================================

const toggleBtn = document.getElementById("togglePassword");

if (toggleBtn) {

    toggleBtn.addEventListener("click", () => {

        const password = document.getElementById("password");

        const icon = toggleBtn.querySelector("i");

        if (password.type === "password") {

            password.type = "text";

            if (icon) {

                icon.className = "bi bi-eye-slash";

            }

        }

        else {

            password.type = "password";

            if (icon) {

                icon.className = "bi bi-eye";

            }

        }

    });

}

// ==============================================
// Enter Key
// ==============================================

document.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        const form = document.getElementById("loginForm");

        if (form) {

            form.requestSubmit();

        }

    }

});
