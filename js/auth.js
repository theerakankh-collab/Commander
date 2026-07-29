// ==============================================
// auth.js
// Military Directory System
// Authentication
// Supabase JS v2
// ==============================================

"use strict";

// ==============================================
// ตรวจสอบ Session
// ==============================================
async function getSession() {

    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    return data.session;

}

// ==============================================
// ดึง User ปัจจุบัน
// ==============================================
async function getCurrentUser() {

    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;

    return data.user;

}

// ==============================================
// ตรวจสอบว่า Login หรือยัง
// ==============================================
async function checkLogin() {

    try {

        const session = await getSession();

        if (!session) {

            window.location.replace("login.html");
            return false;

        }

        return true;

    } catch (err) {

        console.error("Check Login :", err);

        window.location.replace("login.html");

        return false;

    }

}

// ==============================================
// Login อยู่หรือไม่
// ==============================================
async function isLoggedIn() {

    return (await getSession()) !== null;

}

// ==============================================
// User ปัจจุบัน
// ==============================================
async function currentUser() {

    return await getCurrentUser();

}

// ==============================================
// แสดง Email
// ==============================================
async function showCurrentUser() {

    try {

        const user = await currentUser();

        if (!user) return;

        const obj = document.getElementById("userName");

        if (obj) {

            obj.textContent = user.email;

        }

    } catch (err) {

        console.error(err);

    }

}

// ==============================================
// Logout
// ==============================================
async function logout() {

    try {

        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        window.location.replace("login.html");

    } catch (err) {

        alert(err.message);

    }

}

// ==============================================
// Logout จากปุ่ม
// ==============================================
function logoutSystem() {

    logout();

}

// ==============================================
// ตรวจสอบสิทธิ์
// ==============================================
async function checkRole(requiredRole) {

    try {

        const user = await currentUser();

        if (!user) return false;

        const { data, error } = await supabase
            .from("personnel")
            .select("role")
            .eq("email", user.email)
            .single();

        if (error) {

            console.log(error);

            return false;

        }

        return data.role === requiredRole;

    } catch (err) {

        console.error(err);

        return false;

    }

}

// ==============================================
// Admin Only
// ==============================================
async function requireAdmin() {

    const ok = await checkRole("admin");

    if (!ok) {

        alert("ไม่มีสิทธิ์ใช้งาน");

        window.location.replace("dashboard.html");

    }

}

// ==============================================
// แสดง Error
// ==============================================
function showError(err) {

    alert(err.message || err);

}

// ==============================================
// โหลดอัตโนมัติ
// ==============================================
document.addEventListener("DOMContentLoaded", async () => {

    if (document.body.dataset.auth === "required") {

        const ok = await checkLogin();

        if (ok) {

            await showCurrentUser();

        }

    }

});
