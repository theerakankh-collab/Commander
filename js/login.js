// ======================================
// login.js
// ระบบ Login
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    const loginBtn = document.getElementById("loginBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", login);
    }

    // กด Enter เพื่อ Login
    document.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            login();
        }
    });

});

async function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");
    const btn = document.getElementById("loginBtn");

    msg.innerHTML = "";

    // ตรวจสอบข้อมูล
    if (!email) {
        msg.innerHTML = "กรุณากรอกอีเมล";
        return;
    }

    if (!password) {
        msg.innerHTML = "กรุณากรอกรหัสผ่าน";
        return;
    }

    btn.disabled = true;
    btn.innerHTML = "กำลังเข้าสู่ระบบ...";

    try {

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

   if (error) throw error;


// ตรวจสอบข้อมูล User
const { data:userData } = await supabase.auth.getUser();


if(userData.user){

    localStorage.setItem(
        "user_id",
        userData.user.id
    );

}


window.location.replace("dashboard.html");

    } catch (err) {

        msg.innerHTML = err.message;

    } finally {

        btn.disabled = false;
        btn.innerHTML = "เข้าสู่ระบบ";

    }

}
