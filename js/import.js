// ==========================================
// import.js
// Import Excel -> Supabase
// ==========================================

checkLogin();

async function importExcel() {

    const file = document.getElementById("excelFile").files[0];

    if (!file) {
        alert("กรุณาเลือกไฟล์ Excel");
        return;
    }

    const status = document.getElementById("status");
    const progress = document.getElementById("progress");

    status.innerHTML = "กำลังอ่านไฟล์...";

    const reader = new FileReader();

    reader.onload = async function (e) {

        try {

            const workbook = XLSX.read(e.target.result, {
                type: "binary"
            });

            const sheet =
                workbook.Sheets[workbook.SheetNames[0]];

            const rows =
                XLSX.utils.sheet_to_json(sheet);

            if (rows.length === 0) {

                alert("ไม่พบข้อมูลในไฟล์");

                return;

            }

            let success = 0;
            let fail = 0;

            for (let i = 0; i < rows.length; i++) {

                const r = rows[i];

                const personnel = {

                    rank: r["ยศ"] || "",
                    firstname: r["ชื่อ"] || "",
                    lastname: r["สกุล"] || "",
                    nickname: r["ชื่อเล่น"] || "",
                    position: r["ตำแหน่ง"] || "",
                    class: r["ตท."] || "",
                    phone: r["โทรศัพท์"] || "",
                    remark: r["หมายเหตุ"] || ""

                };

                const { error } =
                    await supabase
                        .from("personnel")
                        .insert([personnel]);

                if (error) {

                    console.error(error);

                    fail++;

                } else {

                    success++;

                }

                // Progress Bar

                const percent =
                    Math.round(((i + 1) / rows.length) * 100);

                if (progress) {

                    progress.style.width = percent + "%";

                    progress.innerHTML = percent + "%";

                }

                status.innerHTML =
                    `กำลังนำเข้า ${i + 1} / ${rows.length}`;

            }

            status.innerHTML =
                `✅ สำเร็จ ${success} รายการ<br>❌ ผิดพลาด ${fail} รายการ`;

            alert("นำเข้าข้อมูลเรียบร้อย");

        } catch (err) {

            console.error(err);

            alert(err.message);

        }

    };

    reader.readAsBinaryString(file);

}
