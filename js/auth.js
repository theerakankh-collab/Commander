// ==============================================
// auth.js
// Military Directory System
// Authentication
// Version 3.0
// ==============================================

"use strict";

/**
 * ตรวจสอบ Session
 */
async function checkLogin() {

    try {

        const session = await getSession();

        if (!session) {

            window.location.replace("login.html");

            return false;

        }

        return true;

    }

    catch (err) {

        console.error(err);

        window.location.replace("login.html");

        return false;

    }

}

/**
 * ตรวจสอบว่า Login อยู่หรือไม่
 */
async function isLoggedIn() {

    const session = await getSession();

    return session !== null;

}

/**
 * ดึง User ปัจจุบัน
 */
async function currentUser() {

    try {

        return await getCurrentUser();

    }

    catch (err) {

        console.error(err);

        return null;

    }

}

/**
 * แสดง Email
 */
async function showCurrentUser() {

    try {

        const user = await currentUser();

        if (!user)
            return;

        const obj =
            document.getElementById("userName");

        if (obj) {

            obj.textContent =
                user.email;

        }

    }

    catch (err) {

        console.error(err);

    }

}

/**
 * Logout
 */
async function logoutSystem() {

    try {

        await logout();

    }

    catch (err) {

        showError(err);

    }

}

/**
 * ตรวจสอบสิทธิ์
 */
async function checkRole(requiredRole) {

    try {

        const user =
            await currentUser();

        if (!user)
            return false;

        const {

            data,

            error

        } = await supabase

            .from("personnel")

            .select("role")

            .eq("email", user.email)

            .single();

        if (error)
            throw error;

        if (!data)
            return false;

        return data.role === requiredRole;

    }

    catch (err) {

        console.error(err);

        return false;

    }

}

/**
 * Admin Only
 */
async function requireAdmin() {

    const ok =
        await checkRole("admin");

    if (!ok) {

        alert("ไม่มีสิทธิ์ใช้งาน");

        location.replace(
            "dashboard.html"
        );

    }

}

/**
 * Commander Only
 */
async function requireCommander() {

    const ok =
        await checkRole(
            "commander"
        );

    if (!ok) {

        alert("ไม่มีสิทธิ์ใช้งาน");

        location.replace(
            "dashboard.html"
        );

    }

}

/**
 * User Name
 */
async function loadUserName() {

    await showCurrentUser();

}

/**
 * Auto
 */
document.addEventListener(

    "DOMContentLoaded",

    async () => {

        if (

            document.body.dataset.auth === "required"

        ) {

            const ok =
                await checkLogin();

            if (ok) {

                await loadUserName();

            }

        }

    }

);
