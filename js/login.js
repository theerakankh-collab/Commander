// ==========================================
// login.js
// Military Directory System
// Version 2.0
// ==========================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // ถ้า Login อยู่แล้ว ให้เข้าหน้า Dashboard
    checkAlreadyLogin();

    // Form Login
    const form = document.getElementById("loginForm");

    if (form) {

        form.addEventListener("submit", loginSubmit);

    }

});

// ==========================================
// ถ้า Login แล้ว
// ==========================================

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

// ==========================================
// Login
// ==========================================

async function loginSubmit(event) {

    event.preventDefault();

    const email =
        document.getElementById("email")
        .value
        .trim();

    const password =
        document.getElementById("password")
        .value
        .trim();

    const msg =
        document.getElementById("msg");

    const btn =
        document.getElementById("loginBtn");

    msg.textContent = "";

    // ----------------------------
    // Validation
    // ----------------------------

    if (email === "") {

        msg.textContent =
            "กรุณากรอก Email";

        return;

    }

    if (password === "") {

        msg.textContent =
            "กรุณากรอกรหัสผ่าน";

        return;

    }

    // ตรวจสอบรูปแบบ Email

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        msg.textContent =
            "รูปแบบ Email ไม่ถูกต้อง";

        return;

    }

    try {

        showLoading(
            btn,
            "กำลังเข้าสู่ระบบ..."
        );

        // Login

        const {

            data,

            error

        } = await supabase.auth.signInWithPassword({

            email,

            password

        });

        if (error)
            throw error;

        // เก็บ User ID

        if (data.user) {

            localStorage.setItem(

                "user_id",

                data.user.id

            );

            localStorage.setItem(

                "user_email",

                data.user.email

            );

        }

        showSuccess("เข้าสู่ระบบสำเร็จ");

        window.location.replace(
            "dashboard.html"
        );

    }

    catch (err) {

        console.error(err);

        msg.textContent =
            err.message;

    }

    finally {

        hideLoading(btn);

    }

}

// ==========================
// Loading Button
// ==========================
function showLoading(btn, text = "กำลังโหลด...") {

    if (!btn) return;

    btn.disabled = true;
    btn.dataset.oldText = btn.innerHTML;
    btn.innerHTML = text;

}

function hideLoading(btn) {

    if (!btn) return;

    btn.disabled = false;
    btn.innerHTML = btn.dataset.oldText || "เข้าสู่ระบบ";

}

// ==========================
// Success Message
// ==========================
function showSuccess(text) {

    alert(text);

}
