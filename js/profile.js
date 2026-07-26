// ========================================
// profile.js
// แสดงข้อมูลกำลังพล
// ========================================

// รับ id จาก URL
const id = new URLSearchParams(window.location.search).get("id");

// เริ่มโหลดข้อมูล
window.onload = () => {

    if (!id) {
        alert("ไม่พบรหัสข้อมูล");
        window.location.href = "dashboard.html";
        return;
    }

    loadPersonnel();

};

// โหลดข้อมูล
async function loadPersonnel() {

    try {

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/personnel?id=eq.${id}&select=*`,
            {
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("ไม่สามารถโหลดข้อมูลได้");
        }

        const data = await response.json();

        if (data.length === 0) {
            alert("ไม่พบข้อมูลกำลังพล");
            window.location.href = "dashboard.html";
            return;
        }

        const p = data[0];

        document.getElementById("fullname").textContent =
            `${p.firstname || ""} ${p.lastname || ""}`;

        document.getElementById("rank").textContent =
            p.rank || "-";

        document.getElementById("position").textContent =
            p.position || "-";

        document.getElementById("nickname").textContent =
            p.nickname || "-";

        document.getElementById("class").textContent =
            p.class || "-";

        document.getElementById("phone").textContent =
            p.phone || "-";

        document.getElementById("remark").textContent =
            p.remark || "-";

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}



// =======================================
// profile.js
// =======================================

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

async function loadPersonnel() {

    try {

        const { data, error } = await supabase
            .from("personnel")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;

        document.getElementById("fullname").textContent =
            `${data.rank || ""} ${data.firstname || ""} ${data.lastname || ""}`;

        document.getElementById("rank").textContent =
            data.rank || "-";

        document.getElementById("firstname").textContent =
            data.firstname || "-";

        document.getElementById("lastname").textContent =
            data.lastname || "-";

        document.getElementById("position").textContent =
            data.position || "-";

        document.getElementById("nickname").textContent =
            data.nickname || "-";

        document.getElementById("class").textContent =
            data.class || "-";

        document.getElementById("phone").textContent =
            data.phone || "-";

        document.getElementById("remark").textContent =
            data.remark || "-";

        const photo = document.getElementById("photo");

        if (photo) {

            photo.src = data.photo || "images/no-photo.png";

        }

    } catch (err) {

        console.error(err);

        alert(err.message);

        window.location.href = "dashboard.html";

    }

}

function goBack() {

    window.location.href = "dashboard.html";

}

