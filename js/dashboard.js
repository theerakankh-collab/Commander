// 1. ปรับปรุงฟังก์ชัน count ให้ดึงแค่จำนวนแถวจาก Supabase (ไม่ดึงข้อมูลทั้งหมด)
async function count(table) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?select=id`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: "Bearer " + SUPABASE_KEY,
          Prefer: "count=exact",
          Range: "0-0" // ไม่โหลดเนื้อหา ดึงแค่ Header นับจำนวน
        }
      }
    );
    const contentRange = res.headers.get("content-range");
    if (contentRange) {
      // ตัวอย่าง content-range: "0-0/150" -> ตัดเอาเฉพาะเลข 150
      return parseInt(contentRange.split("/")[1], 10) || 0;
    }
    return 0;
  } catch (error) {
    console.error(`Error counting ${table}:`, error);
    return 0;
  }
}

// โหลดสรุปจำนวน
async function loadSummary() {
  document.getElementById("totalPersonnel").innerHTML = await count("personnel");
  document.getElementById("totalCommander").innerHTML = await count("commanders");
  document.getElementById("totalWife").innerHTML = await count("wives");
}

let personnel = [];

// โหลดข้อมูลบุคลากร
async function loadPersonnel() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/personnel?select=*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: "Bearer " + SUPABASE_KEY
        }
      }
    );
    personnel = await res.json();
    
    // แสดงตาราง
    renderTable(personnel);

    // นับจำนวนคนที่มีเบอร์โทรศัพท์ (เช็กกันค่า null/undefined)
    const phoneCount = personnel.filter(x => x.phone && x.phone.trim() !== "").length;
    document.getElementById("totalPhone").innerHTML = phoneCount;
  } catch (error) {
    console.error("Error loading personnel:", error);
  }
}

// ฟังก์ชันแสดงผลตาราง + DataTables (เหลือแค่อันเดียว)
function renderTable(data) {
  let html = "";
  data.forEach(p => {
    html += `
      <tr>
        <td>${p.rank || ''}</td>
        <td>${p.firstname || ''} ${p.lastname || ''}</td>
        <td>${p.position || ''}</td>
        <td>${p.phone || '-'}</td>
        <td>
          <button class="btn btn-success btn-sm" onclick="view(${p.id})">
            รายละเอียด
          </button>
        </td>
      </tr>
    `;
  });

  $("#result").html(html);

  // Re-initialize DataTables
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

  // เชื่อมต่อช่อง #search Custom เข้ากับระบบค้นหาของ DataTables Direct
  $("#search").off("keyup").on("keyup", function () {
    table.search(this.value).draw();
  });
}

function view(id) {
  window.location.href = "profile.html?id=" + id;
}

// เรียกใช้งานเมื่อเริ่มต้น
loadSummary();
loadPersonnel();
