// ==============================================
// export.js
// Military Directory System
// Export Personnel
// Version 3.0
// ==============================================

"use strict";

/**
 * Export Excel
 */
async function exportExcel() {

    const btn = document.getElementById("btnExportExcel");

    try {

        showLoading(btn, "กำลังสร้างไฟล์...");

        const { data, error } = await supabase
            .from("personnel")
            .select("*")
            .order("lastname")
            .order("firstname");

        if (error) throw error;

        if (!data || data.length === 0) {

            throw new Error("ไม่มีข้อมูลสำหรับ Export");

        }

        const rows = data.map(item => ({

            "ยศ": item.rank,
            "ชื่อ": item.firstname,
            "นามสกุล": item.lastname,
            "ชื่อเล่น": item.nickname,
            "ตำแหน่ง": item.position,
            "ชั้น": item.class,
            "โทรศัพท์": item.phone,
            "หมายเหตุ": item.remark

        }));

        const workbook = XLSX.utils.book_new();

        const worksheet = XLSX.utils.json_to_sheet(rows);

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Personnel"
        );

        XLSX.writeFile(
            workbook,
            `Personnel_${new Date().toISOString().substring(0,10)}.xlsx`
        );

        showSuccess("Export Excel สำเร็จ");

    }

    catch(err){

        showError(err);

    }

    finally{

        hideLoading(btn);

    }

}

/**
 * Export CSV
 */
async function exportCSV(){

    const btn = document.getElementById("btnExportCSV");

    try{

        showLoading(btn,"กำลังสร้างไฟล์...");

        const {data,error}=await supabase

            .from("personnel")

            .select("*")

            .order("lastname")

            .order("firstname");

        if(error) throw error;

        if(!data || data.length===0){

            throw new Error("ไม่มีข้อมูล");

        }

        const rows=data.map(item=>({

            rank:item.rank,
            firstname:item.firstname,
            lastname:item.lastname,
            nickname:item.nickname,
            position:item.position,
            class:item.class,
            phone:item.phone,
            remark:item.remark

        }));

        const sheet=XLSX.utils.json_to_sheet(rows);

        const csv=XLSX.utils.sheet_to_csv(sheet);

        const blob=new Blob(
            ["\uFEFF"+csv],
            {type:"text/csv;charset=utf-8;"}
        );

        const url=URL.createObjectURL(blob);

        const a=document.createElement("a");

        a.href=url;

        a.download="Personnel.csv";

        document.body.appendChild(a);

        a.click();

        a.remove();

        URL.revokeObjectURL(url);

        showSuccess("Export CSV สำเร็จ");

    }

    catch(err){

        showError(err);

    }

    finally{

        hideLoading(btn);

    }

}

/**
 * Export เฉพาะผลการค้นหาใน DataTable
 */
function exportCurrentTable(){

    const table=$("#personTable").DataTable();

    const rows=table.rows({
        search:"applied"
    }).data().toArray();

    if(rows.length===0){

        alert("ไม่มีข้อมูล");

        return;

    }

    const workbook=XLSX.utils.book_new();

    const worksheet=XLSX.utils.json_to_sheet(rows);

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Search Result"
    );

    XLSX.writeFile(
        workbook,
        "Search_Result.xlsx"
    );

}
