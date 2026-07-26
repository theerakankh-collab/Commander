// ==========================================
// edit.js
// แก้ไขข้อมูลกำลังพล
// ==========================================

checkLogin();

const id = new URLSearchParams(window.location.search).get("id");

window.addEventListener("DOMContentLoaded", () => {

    if (!id) {
        alert("ไม่พบรหัสข้อมูล");
        window.location.href = "dashboard.html";
        return;
    }

    loadPersonnel();

});

// โหลดข้อมูล
async function loadPersonnel() {

    try {

        const { data, error } = await supabase
            .from("personnel")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;

        document.getElementById("rank").value = data.rank || "";
        document.getElementById("firstname").value = data.firstname || "";
        document.getElementById("lastname").value = data.lastname || "";
        document.getElementById("position").value = data.position || "";
        document.getElementById("nickname").value = data.nickname || "";
        document.getElementById("class").value = data.class || "";
        document.getElementById("phone").value = data.phone || "";
        document.getElementById("remark").value = data.remark || "";

    } catch (err) {

        alert(err.message);

        window.location.href = "dashboard.html";

    }

}

// บันทึก
async function updatePersonnel() {

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

    if (data.firstname === "") {

        alert("กรุณากรอกชื่อ");

        return;

    }

    try {

        const { error } = await supabase
            .from("personnel")
            .update(data)
            .eq("id", id);

        if (error) throw error;

        alert("บันทึกข้อมูลเรียบร้อย");

        window.location.href = "dashboard.html";

    } catch (err) {

        alert(err.message);

    }

}
