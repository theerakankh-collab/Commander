// =============================================
// auth.js
// Military Directory
// Authentication ด้วย Supabase
// =============================================

// ------------------------------
// ตรวจสอบการ Login
// ------------------------------
async function checkLogin() {

    try {

        const {
            data: { session },
            error
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (!session) {

            window.location.replace("login.html");
            return;

        }

        // แสดงชื่อผู้ใช้ (ถ้ามี Element)
        const userName = document.getElementById("userName");

        if (userName) {

            userName.innerHTML =
                session.user.email;

        }

    } catch (err) {

        console.error("Check Login Error :", err);

        window.location.replace("login.html");

    }

}


// ------------------------------
// Login
// ------------------------------
async function login(email, password) {

    try {

        const { error } =
            await supabase.auth.signInWithPassword({

                email,
                password

            });

        if (error) throw error;

        window.location.replace("dashboard.html");

    } catch (err) {

        alert(err.message);

    }

}


// ------------------------------
// Logout
// ------------------------------
async function logout() {

    if (!confirm("ต้องการออกจากระบบใช่หรือไม่ ?"))
        return;

    try {

        const { error } =
            await supabase.auth.signOut();

        if (error) throw error;

        window.location.replace("login.html");

    } catch (err) {

        alert(err.message);

    }

}


// ------------------------------
// ดึงข้อมูล User ปัจจุบัน
// ------------------------------
async function getCurrentUser() {

    const {
        data: { user }
    } = await supabase.auth.getUser();

    return user;

}


// ------------------------------
// ตรวจสอบสิทธิ์
// ------------------------------
async function isLoggedIn() {

    const {
        data: { session }
    } = await supabase.auth.getSession();

    return session !== null;

}
