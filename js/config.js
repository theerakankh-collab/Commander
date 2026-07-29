// ==============================================
// config.js
// Military Directory System
// Version 2.0
// ==============================================

"use strict";

// ----------------------------------------------
// Supabase Configuration
// ----------------------------------------------

const SUPABASE_URL = "https://sftbzmwrrymlgbsmuima.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_J3UrucI0x66JEbHUQQHlXA_QFQf-ioz";

// ----------------------------------------------
// ตรวจสอบว่าโหลด Library แล้ว
// ----------------------------------------------

if (!window.supabase) {

    alert("ไม่พบ Supabase Library");

    throw new Error("Supabase JS Library not found.");

}

// ----------------------------------------------
// Create Client
// ----------------------------------------------

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
        auth: {

            persistSession: true,

            autoRefreshToken: true,

            detectSessionInUrl: true

        }

    }
);

// ----------------------------------------------
// Console
// ----------------------------------------------

console.log("====================================");
console.log("Military Directory");
console.log("Supabase Connected");
console.log(SUPABASE_URL);
console.log("====================================");

// ----------------------------------------------
// Loading Button
// ----------------------------------------------

function showLoading(button, text = "กำลังดำเนินการ...") {

    if (!button) return;

    button.disabled = true;

    button.dataset.oldText = button.innerHTML;

    button.innerHTML = text;

}

function hideLoading(button) {

    if (!button) return;

    button.disabled = false;

    button.innerHTML = button.dataset.oldText || "บันทึก";

}

// ----------------------------------------------
// Alert
// ----------------------------------------------

function showSuccess(message) {

    alert(message);

}

function showError(error) {

    console.error(error);

    alert(

        error?.message ||

        error ||

        "เกิดข้อผิดพลาด"

    );

}

// ----------------------------------------------
// Current User
// ----------------------------------------------

async function getCurrentUser() {

    const {

        data,

        error

    } = await supabase.auth.getUser();

    if (error) {

        console.error(error);

        return null;

    }

    return data.user;

}

// ----------------------------------------------
// Session
// ----------------------------------------------

async function getSession() {

    const {

        data,

        error

    } = await supabase.auth.getSession();

    if (error) {

        console.error(error);

        return null;

    }

    return data.session;

}

// ----------------------------------------------
// Login Required
// ----------------------------------------------

async function requireLogin() {

    const session = await getSession();

    if (!session) {

        location.replace("login.html");

        return false;

    }

    return true;

}

// ----------------------------------------------
// Logout
// ----------------------------------------------

async function logout() {

    if (!confirm("ต้องการออกจากระบบใช่หรือไม่ ?"))

        return;

    const { error } =

        await supabase.auth.signOut();

    if (error) {

        showError(error);

        return;

    }

    localStorage.clear();

    sessionStorage.clear();

    location.replace("login.html");

}

// ----------------------------------------------
// Page Ready
// ----------------------------------------------

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        if (

            document.body.dataset.auth === "required"

        ) {

            await requireLogin();

        }

    }

);

console.log("window.supabase =", window.supabase);
console.log("supabase =", supabase);
console.log("supabase.from =", typeof supabase.from);
console.log("supabase.auth =", typeof supabase.auth);


