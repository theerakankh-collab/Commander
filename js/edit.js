// ==============================================
// edit.js
// Military Directory System
// Edit Personnel
// Version 3.0
// ==============================================

"use strict";

let personnelId = null;

// ==============================================

document.addEventListener("DOMContentLoaded", async () => {

    personnelId = Number(
        new URLSearchParams(window.location.search).get("id")
    );

    if (!personnelId || isNaN(personnelId)) {

        alert("ไม่พบรหัสกำลังพล");

        location.href = "dashboard.html";

        return;

    }

    await loadPersonnel();

    const form = document.getElementById("frm");

    if (form) {

        form.addEventListener("submit", updatePersonnel);

    }

});

// ==============================================
// โหลดข้อมูล
// ==============================================

async function loadPersonnel() {

    try {

        const { data, error } = await supabase

            .from("personnel")

            .select("*")

            .eq("id", personnelId)

            .single();

        if (error)
            throw error;

        document.getElementById("rank").value =
            data.rank || "";

        document.getElementById("firstname").value =
            data.firstname || "";

        document.getElementById("lastname").value =
            data.lastname || "";

        document.getElementById("nickname").value =
            data.nickname || "";

        document.getElementById("position").value =
            data.position || "";

        document.getElementById("class_name").value =
            data.class || "";

        document.getElementById("phone").value =
            data.phone || "";

        document.getElementById("remark").value =
            data.remark || "";

        if (document.getElementById("photo")) {

            document.getElementById("photo").src =
                data.image || "images/no-photo.png";

        }

    }

    catch (err) {

        showError(err);

    }

}

// ==============================================
// บันทึก
// ==============================================

async function updatePersonnel(event) {

    event.preventDefault();

    const btn = document.getElementById("btnSave");

    try {

        showLoading(btn, "กำลังบันทึก...");

        const data = {

            rank:
                document.getElementById("rank").value.trim(),

            firstname:
                document.getElementById("firstname").value.trim(),

            lastname:
                document.getElementById("lastname").value.trim(),

            nickname:
                document.getElementById("nickname").value.trim(),

            position:
                document.getElementById("position").value.trim(),

            class:
                document.getElementById("class_name").value.trim(),

            phone:
                document.getElementById("phone").value.trim(),

            remark:
                document.getElementById("remark").value.trim()

        };

        // ------------------------
        // Validation
        // ------------------------

        if (!data.rank)
            throw new Error("กรุณาเลือกยศ");

        if (!data.firstname)
            throw new Error("กรุณากรอกชื่อ");

        if (!data.lastname)
            throw new Error("กรุณากรอกนามสกุล");

        if (data.phone !== "") {

            const phoneRegex =
                /^[0-9]{9,10}$/;

            if (!phoneRegex.test(data.phone)) {

                throw new Error(
                    "เบอร์โทรศัพท์ไม่ถูกต้อง"
                );

            }

        }

        // ------------------------
        // ตรวจสอบข้อมูลซ้ำ
        // ------------------------

        const {

            data: duplicate,

            error: duplicateError

        } = await supabase

            .from("personnel")

            .select("id")

            .eq("firstname", data.firstname)

            .eq("lastname", data.lastname)

            .neq("id", personnelId)

            .maybeSingle();

        if (duplicateError)
            throw duplicateError;

        if (duplicate) {

            throw new Error(
                "พบข้อมูลซ้ำในระบบ"
            );

        }

        // ------------------------
        // Update
        // ------------------------

        const { error } = await supabase

            .from("personnel")

            .update(data)

            .eq("id", personnelId);

        if (error)
            throw error;

        showSuccess("บันทึกข้อมูลเรียบร้อย");

        location.href =
            "profile.html?id=" + personnelId;

    }

    catch (err) {

        showError(err);

    }

    finally {

        hideLoading(btn);

    }

}

// ==============================================
// ย้อนกลับ
// ==============================================

function backProfile() {

    location.href =
        "profile.html?id=" + personnelId;

}

// ==============================================
// รีโหลดข้อมูล
// ==============================================

function refresh() {

    loadPersonnel();

}
