// =====================================================
// auth.js
// Military Directory System
// Authentication Module
// Version 3.0
// =====================================================

"use strict";

// =====================================================
// CACHE
// =====================================================

let currentProfile = null;

// =====================================================
// LOAD PROFILE
// =====================================================

async function getProfile(refresh = false) {

    if (!refresh && currentProfile) {
        return currentProfile;
    }

    const user = await getCurrentUser();

    if (!user) return null;

    const { data, error } = await supabaseClient
        .from("personnel")
        .select("*")
        .eq("auth_user_id", user.id)
        .maybeSingle();

    if (error) {
        console.error(error);
        return null;
    }

    currentProfile = data;

    return currentProfile;
}

// =====================================================
// LOGIN CHECK
// =====================================================

async function checkLogin() {

    const session = await getSession();

    if (!session) {

        window.location.replace("login.html");

        return false;

    }

    return true;

}

// =====================================================
// SHOW USER
// =====================================================

async function showCurrentUser() {

    const profile = await getProfile();

    if (!profile) return;

    const userName = document.getElementById("userName");

    if (userName) {

        userName.textContent =
            `${profile.rank} ${profile.firstname} ${profile.lastname}`;

    }

}

// =====================================================
// ROLE
// =====================================================

async function getRole() {

    const profile = await getProfile();

    return profile?.role ?? "user";

}

async function hasRole(...roles) {

    const role = await getRole();

    return roles.includes(role);

}

// =====================================================
// PERMISSION
// =====================================================

async function requireRole(...roles) {

    const ok = await hasRole(...roles);

    if (ok) return;

    alert("ไม่มีสิทธิ์ใช้งาน");

    location.replace("dashboard.html");

}

async function requireAdmin() {

    await requireRole("admin");

}

async function requireCommander() {

    await requireRole(
        "admin",
        "commander"
    );

}

// =====================================================
// HELPERS
// =====================================================

function isAdmin() {

    return currentProfile?.role === "admin";

}

function isCommander() {

    return currentProfile?.role === "commander";

}

function isUser() {

    return currentProfile?.role === "user";

}

// =====================================================
// REFRESH PROFILE
// =====================================================

async function refreshProfile() {

    currentProfile = null;

    return await getProfile(true);

}

// =====================================================
// AUTH LISTENER
// =====================================================

supabaseClient.auth.onAuthStateChange(

    async (event, session) => {

        if (!session) {

            currentProfile = null;

            if (document.body.dataset.auth === "required") {

                location.replace("login.html");

            }

            return;

        }

        currentProfile = null;

    }

);

// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        if (
            document.body.dataset.auth === "required"
        ) {

            const ok = await checkLogin();

            if (!ok) return;

            await showCurrentUser();

        }

    }

);
