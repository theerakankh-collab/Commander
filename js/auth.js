// ==============================================
// auth.js
// Military Directory System
// Authentication Module
// Version 2.0
// ==============================================

"use strict";

// ==============================================
// Cache
// ==============================================

let currentSession = null;
let currentUser = null;
let currentProfile = null;

// ==============================================
// Session
// ==============================================

async function getSession() {

    if (currentSession) {
        return currentSession;
    }

    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    currentSession = data.session;

    return currentSession;

}

// ==============================================
// Current User
// ==============================================

async function getCurrentUser() {

    if (currentUser) {
        return currentUser;
    }

    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;

    currentUser = data.user;

    return currentUser;

}

// ==============================================
// Current Profile
// ==============================================

async function getProfile() {

    if (currentProfile) {
        return currentProfile;
    }

    const user = await getCurrentUser();

    if (!user) return null;

    const { data, error } = await supabase

        .from("personnel")

        .select("*")

        .eq("auth_user_id", user.id)

        .single();

    if (error) throw error;

    currentProfile = data;

    return data;

}

// ==============================================
// Login Check
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

        console.error(err);

        window.location.replace("login.html");

        return false;

    }

}

// ==============================================
// Logged In ?
// ==============================================

async function isLoggedIn() {

    return (await getSession()) !== null;

}

// ==============================================
// Show Current User
// ==============================================

async function showCurrentUser() {

    try {

        const profile = await getProfile();

        if (!profile) return;

        const obj = document.getElementById("userName");

        if (!obj) return;

        obj.textContent =

            `${profile.rank} ${profile.firstname} ${profile.lastname}`;

    }

    catch (err) {

        console.error(err);

    }

}

// ==============================================
// Role
// ==============================================

async function getRole() {

    const profile = await getProfile();

    return profile ? profile.role : null;

}

// ==============================================
// Check Role
// ==============================================

async function checkRole(requiredRole) {

    const role = await getRole();

    return role === requiredRole;

}

// ==============================================
// Admin
// ==============================================

async function requireAdmin() {

    const role = await getRole();

    if (role !== "admin") {

        alert("ไม่มีสิทธิ์ใช้งาน");

        window.location.replace("dashboard.html");

    }

}

// ==============================================
// Commander
// ==============================================

async function requireCommander() {

    const role = await getRole();

    if (

        role !== "admin" &&

        role !== "commander"

    ) {

        alert("ไม่มีสิทธิ์ใช้งาน");

        window.location.replace("dashboard.html");

    }

}

// ==============================================
// User
// ==============================================

async function requireUser() {

    const ok = await checkLogin();

    if (!ok) {

        window.location.replace("login.html");

    }

}

// ==============================================
// Logout
// ==============================================

async function logout() {

    try {

        const { error } =

            await supabase.auth.signOut();

        if (error) throw error;

        currentSession = null;
        currentUser = null;
        currentProfile = null;

        window.location.replace("login.html");

    }

    catch (err) {

        alert(err.message);

    }

}

// ==============================================

function logoutSystem() {

    logout();

}

// ==============================================
// Helpers
// ==============================================

function isAdmin() {

    return currentProfile?.role === "admin";

}

function isCommander() {

    return currentProfile?.role === "commander";

}

function isUser() {

    return currentProfile?.role === "user";

}

// ==============================================
// Error
// ==============================================

function showError(err) {

    const msg = document.getElementById("msg");

    if (msg) {

        msg.classList.remove("d-none");

        msg.textContent = err.message || err;

    } else {

        alert(err.message || err);

    }

}

// ==============================================
// Auth Listener
// ==============================================

supabase.auth.onAuthStateChange(

    (event, session) => {

        currentSession = session;

        currentUser = session?.user || null;

        currentProfile = null;

    }

);

// ==============================================
// Auto Load
// ==============================================

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        if (document.body.dataset.auth === "required") {

            const ok = await checkLogin();

            if (ok) {

                await showCurrentUser();

            }

        }

    }

);
