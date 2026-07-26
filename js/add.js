// =============================
// add.js
// เพิ่มข้อมูลกำลังพล
// =============================

async function save() {

    // รับค่าจากฟอร์ม
    const data = {
        rank: document.getElementById("rank").value.trim(),
        firstname: document.getElementById("firstname").value.trim(),
        lastname: document.getElementById("lastname").value.trim(),
        position: document.getElementById("position").value.trim(),
        nickname: document.getElementById("nickname").value.trim(),
        class: document.getElementById("class").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        remark: document.getElementById("remark").value.trim()
    };

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!data.rank) {
        alert("กรุณากรอกยศ");
        document.getElementById("rank").focus();
        return;
    }

    if (!data.firstname) {
        alert("กรุณากรอกชื่อ");
        document.getElementById("firstname").focus();
        return;
    }

    if (!data.lastname) {
        alert("กรุณากรอกนามสกุล");
        document.getElementById("lastname").focus();
        return;
    }

    // ปิดปุ่มชั่วคราว ป้องกันการกดซ้ำ
    const btn = document.querySelector("button[onclick='save()']");
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = "กำลังบันทึก...";
    }

    try {

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/personnel`,
            {
                method: "POST",
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`,
                    "Content-Type": "application/json",
                    Prefer: "return=representation"
                },
                body: JSON.stringify(data)
            }
        );

        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(errorText);

        }

        alert("✅ บันทึกข้อมูลเรียบร้อย");

        window.location.href = "dashboard.html";

    } catch (error) {

        console.error("Save Error :", error);

        alert("❌ ไม่สามารถบันทึกข้อมูลได้\n\n" + error.message);

    } finally {

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = "บันทึก";
        }

    }

}
