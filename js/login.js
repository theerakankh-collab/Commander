// =====================================================
// login.js
// Military Directory System
// Version 4.0
// =====================================================

"use strict";

// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    if (typeof window.supabaseClient === "undefined") {

        alert("ไม่สามารถเชื่อมต่อระบบได้ (Supabase Client)");

        console.error("supabaseClient not found");

        return;
    }

    checkAlreadyLogin();

    const form = document.getElementById("loginForm");

    if (form) {
        form.addEventListener("submit", loginSubmit);
    }

    initPasswordToggle();

});

// =====================================================
// CHECK LOGIN
// =====================================================

async function checkAlreadyLogin() {

    try {

        const session = await getSession();

        if (session) {

            window.location.replace("dashboard.html");

        }

    } catch (err) {

        console.error(err);

    }

}

// =====================================================
// LOGIN
// =====================================================

async function loginSubmit(e) {

    e.preventDefault();

    clearMessage();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email) {

        showMessage("กรุณากรอกอีเมล");

        emailInput.focus();

        return;

    }

    if (!emailInput.checkValidity()) {

        showMessage("รูปแบบอีเมลไม่ถูกต้อง");

        emailInput.focus();

        return;

    }

    if (!password) {

        showMessage("กรุณากรอกรหัสผ่าน");

        passwordInput.focus();

        return;

    }

    setLoading(true);

    try {

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });

        if (error) throw error;

        if (!data.user) {

            throw new Error("ไม่พบข้อมูลผู้ใช้งาน");

        }

        showMessage("เข้าสู่ระบบสำเร็จ", "success");

        setTimeout(() => {

            window.location.replace("dashboard.html");

        }, 500);

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

            case "Failed to fetch":

                showMessage("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");

                break;

            default:

                showMessage(err.message || "เกิดข้อผิดพลาด");

        }

    }

    finally {

        setLoading(false);

    }

}

// =====================================================
// PASSWORD TOGGLE
// =====================================================

function initPasswordToggle() {

    const toggleBtn = document.getElementById("togglePassword");

    if (!toggleBtn) return;

    toggleBtn.addEventListener("click", () => {

        const password = document.getElementById("password");

        const icon = toggleBtn.querySelector("i");

        if (!password) return;

        if (password.type === "password") {

            password.type = "text";

            if (icon) {

                icon.className = "bi bi-eye-slash";

            }

        } else {

            password.type = "password";

            if (icon) {

                icon.className = "bi bi-eye";

            }

        }

    });

}

// =====================================================
// BUTTON LOADING
// =====================================================

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

// =====================================================
// MESSAGE
// =====================================================

function showMessage(message, type = "danger") {

    const msg = document.getElementById("msg");

    if (!msg) {

        alert(message);

        return;

    }

    msg.className = `alert alert-${type}`;

    msg.textContent = message;

    msg.classList.remove("d-none");

}

function clearMessage() {

    const msg = document.getElementById("msg");

    if (!msg) return;

    msg.classList.add("d-none");

    msg.textContent = "";

}

// =====================================================
// ENTER KEY
// =====================================================

document.addEventListener("keydown", (e) => {

    if (e.key !== "Enter") return;

    const form = document.getElementById("loginForm");

    if (form) {

        form.requestSubmit();

    }

});
