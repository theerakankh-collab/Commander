// =====================================
// export.js
// Export Personnel -> Excel
// =====================================

checkLogin();

async function exportExcel() {

    try {

        const { data, error } = await supabase
            .from("personnel")
            .select("*")
            .order("rank")
            .order("firstname");

        if (error) throw error;

        if (!data || data.length === 0) {
            alert("ไม่มีข้อมูล");
            return;
        }

        const rows = data.map((p, index) => ({

            "ลำดับ": index + 1,
            "ยศ": p.rank || "",
            "ชื่อ": p.firstname || "",
            "สกุล": p.lastname || "",
            "ชื่อเล่น": p.nickname || "",
            "ตำแหน่ง": p.position || "",
            "ตท.": p.class || "",
            "โทรศัพท์": p.phone || "",
            "หมายเหตุ": p.remark || ""

        }));

        const ws = XLSX.utils.json_to_sheet(rows);

        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            wb,
            ws,
            "Personnel"
        );

        XLSX.writeFile(
            wb,
            "Personnel.xlsx"
        );

    }
    catch(err){

        console.error(err);

        alert(err.message);

    }

}
