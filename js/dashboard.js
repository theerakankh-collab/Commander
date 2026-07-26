// =========================================
// dashboard.js
// ระบบกำลังพล
// =========================================

checkLogin();

let personnel = [];

// =============================
// โหลด Dashboard
// =============================
window.addEventListener("DOMContentLoaded", async () => {

    await loadSummary();

    await loadPersonnel();

});

// =============================
// โหลดสรุป
// =============================
async function loadSummary() {

    try {

        const { count: totalPersonnel } = await supabase
            .from("personnel")
            .select("*", {
                count: "exact",
                head: true
            });

        const { count: totalCommander } = await supabase
            .from("commanders")
            .select("*", {
                count: "exact",
                head: true
            });

        const { count: totalWife } = await supabase
            .from("wives")
            .select("*", {
                count: "exact",
                head: true
            });

        document.getElementById("totalPersonnel").textContent =
            totalPersonnel || 0;

        document.getElementById("totalCommander").textContent =
            totalCommander || 0;

        document.getElementById("totalWife").textContent =
            totalWife || 0;

    } catch (err) {

        console.error(err);

    }

}

// =============================
// โหลดข้อมูลกำลังพล
// =============================
async function loadPersonnel() {

    try {

        const { data, error } = await supabase
            .from("personnel")
            .select("*")
            .order("rank")
            .order("firstname");

        if (error) throw error;

        personnel = data || [];

        renderTable(personnel);

        const phoneCount =
            personnel.filter(p => p.phone && p.phone.trim() !== "").length;

        document.getElementById("totalPhone").textContent =
            phoneCount;

    } catch (err) {

        console.error(err);

        alert(err.message);

    }

}

// =============================
// แสดงตาราง
// =============================
function renderTable(data) {

    let html = "";

    data.forEach(p => {

        html += `
        <tr>

            <td>${p.rank ?? ""}</td>

            <td>${p.firstname ?? ""} ${p.lastname ?? ""}</td>

            <td>${p.position ?? ""}</td>

            <td>${p.phone ?? "-"}</td>

            <td>

                <a
                    href="profile.html?id=${p.id}"
                    class="btn btn-success btn-sm">

                    รายละเอียด

                </a>

                <a
                    href="edit.html?id=${p.id}"
                    class="btn btn-warning btn-sm">

                    แก้ไข

                </a>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="deletePersonnel(${p.id})">

                    ลบ

                </button>

            </td>

        </tr>
        `;

    });

    document.getElementById("result").innerHTML = html;

    if ($.fn.DataTable.isDataTable("#personTable")) {

        $("#personTable").DataTable().destroy();

    }

    const table = $("#personTable").DataTable({

        pageLength: 20,

        responsive: true,

        language: {

            url: "https://cdn.datatables.net/plug-ins/1.13.8/i18n/th.json"

        }

    });

    $("#search")
        .off("keyup")
        .on("keyup", function () {

            table.search(this.value).draw();

        });

}

// =============================
// ลบข้อมูล
// =============================
async function deletePersonnel(id) {

    if (!confirm("ยืนยันการลบข้อมูล ?")) return;

    try {

        const { error } = await supabase
            .from("personnel")
            .delete()
            .eq("id", id);

        if (error) throw error;

        await loadSummary();

        await loadPersonnel();

    } catch (err) {

        alert(err.message);

    }

}

// =============================
// Logout
// =============================
function logoutSystem() {

    logout();

}
