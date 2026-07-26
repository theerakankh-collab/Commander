// =======================================
// profile.js - แสดงข้อมูลกำลังพล
// =======================================

// 1. ตรวจสอบสถานะการเข้าสู่ระบบ
checkLogin();

// 2. ดึงค่า id จาก Query Parameter ใน URL
const id = new URLSearchParams(window.location.search).get("id");

// 3. รอให้ DOM โหลดสมบูรณ์ก่อนเริ่มทำงาน
window.addEventListener("DOMContentLoaded", () => {
    if (!id) {
        alert("ไม่พบรหัสข้อมูล");
        window.location.href = "dashboard.html";
        return;
    }

    loadPersonnel();
});

// 4. ฟังก์ชันโหลดข้อมูลกำลังพลจาก Supabase
async function loadPersonnel() {
    try {
        const { data, error } = await supabase
            .from("personnel")
            .select("*")
            .eq("id", id)
            .single();

        if (error || !data) {
            throw new Error(error?.message || "ไม่พบข้อมูลกำลังพล");
        }

        // แสดงข้อมูลชื่อ-นามสกุล และยศ
        const fullRank = data.rank ? `${data.rank} ` : "";
        document.getElementById("fullname").textContent = 
            `${fullRank}${data.firstname || ""} ${data.lastname || ""}`.trim();

        document.getElementById("rank").textContent = data.rank || "-";
        
        // ตรวจสอบความปลอดภัยของ ID Element ก่อนใส่ค่า
        setElementText("firstname", data.firstname);
        setElementText("lastname", data.lastname);
        setElementText("position", data.position);
        setElementText("nickname", data.nickname);
        setElementText("phone", data.phone);
        setElementText("remark", data.remark);

        // ดึงค่า field 'class' ผ่าน Bracket Notation ป้องกันปัญหา JS Reserved Word
        setElementText("class", data['class']);

        // จัดการรูปภาพ
        const photo = document.getElementById("photo");
        if (photo) {
            photo.src = (data.photo && data.photo.trim() !== "") 
                ? data.photo 
                : "images/no-photo.png";
        }

    } catch (err) {
        console.error("Error loading personnel:", err);
        alert(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
        window.location.href = "dashboard.html";
    }
}

// Helper Function ช่วยอัปเดตข้อความใน DOM อัตโนมัติ (ป้องกัน Error กรณีหา Element ไม่พบ)
function setElementText(elementId, value) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = value || "-";
    }
}

// ฟังก์ชันสำหรับย้อนกลับ
function goBack() {
    window.location.href = "dashboard.html";
}
