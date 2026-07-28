// ==============================================
// add.js
// Military Directory System
// Add Personnel
// Version 3.0
// ==============================================

"use strict";

document.addEventListener("DOMContentLoaded", async () => {

    await checkLogin();

    const form = document.getElementById("frm");

    if (form) {

        form.addEventListener("submit", savePersonnel);

    }

});

// ==============================================
// Save
// ==============================================

async function savePersonnel(event) {

    event.preventDefault();

    const btn = document.getElementById("btnSave");

    try {

        showLoading(btn, "กำลังบันทึก...");

        // -----------------------------
        // อ่านข้อมูลจาก Form
        // -----------------------------

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
                document.getElementById("remark").value.trim(),

            image: null,

            created_at:
                new Date().toISOString()

        };

        // -----------------------------
        // Validation
        // -----------------------------

        if (!data.rank)
            throw new Error("กรุณาระบุยศ");

        if (!data.firstname)
            throw new Error("กรุณากรอกชื่อ");

        if (!data.lastname)
            throw new Error("กรุณากรอกนามสกุล");

        // ตรวจสอบเบอร์โทร

        if (data.phone !== "") {

            const phoneRegex =
                /^[0-9]{9,10}$/;

            if (!phoneRegex.test(data.phone)) {

                throw new Error(
                    "เบอร์โทรไม่ถูกต้อง"
                );

            }

        }

        // -----------------------------
        // ตรวจสอบข้อมูลซ้ำ
        // -----------------------------

        const {

            data: duplicate,

            error: duplicateError

        } = await supabase

            .from("personnel")

            .select("id")

            .eq("firstname", data.firstname)

            .eq("lastname", data.lastname)

            .maybeSingle();

        if (duplicateError)
            throw duplicateError;

        if (duplicate) {

            throw new Error(

                "พบข้อมูลกำลังพลนี้แล้ว"

            );

        }

        // -----------------------------
        // บันทึก
        // -----------------------------

        const {

            error

        } = await supabase

            .from("personnel")

            .insert([data]);

        if (error)
            throw error;

        showSuccess("บันทึกข้อมูลเรียบร้อย");

        window.location.href =
            "dashboard.html";

    }

    catch (err) {

        showError(err);

    }

    finally {

        hideLoading(btn);

    }

}
