// =====================================
// backup.js
// Backup / Restore
// =====================================

checkLogin();

// Backup
async function backupDatabase() {

    const { data, error } = await supabase
        .from("personnel")
        .select("*");

    if (error) {
        alert(error.message);
        return;
    }

    const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
    );

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "personnel_backup.json";

    a.click();

}

// Restore
async function restoreDatabase(file) {

    if (!file) {
        alert("กรุณาเลือกไฟล์ Backup");
        return;
    }

    try {

        const text = await file.text();

        const rows = JSON.parse(text);

        const { error } = await supabase
            .from("personnel")
            .upsert(rows);

        if (error) throw error;

        alert("✅ Restore สำเร็จ");

    } catch (err) {

        alert(err.message);

    }

}
