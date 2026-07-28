// ==============================================
// backup.js
// Military Directory System
// Backup & Restore
// Version 3.0
// ==============================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const restoreFile =
        document.getElementById("restoreFile");

    if (restoreFile) {

        restoreFile.addEventListener(

            "change",

            restoreBackup

        );

    }

});

// ==============================================
// BACKUP
// ==============================================

async function backupDatabase() {

    const btn =
        document.getElementById("btnBackup");

    try {

        showLoading(btn, "กำลังสำรองข้อมูล...");

        const [

            personnel,

            commanders,

            wives

        ] = await Promise.all([

            supabase
                .from("personnel")
                .select("*"),

            supabase
                .from("commanders")
                .select("*"),

            supabase
                .from("wives")
                .select("*")

        ]);

        if (personnel.error)
            throw personnel.error;

        if (commanders.error)
            throw commanders.error;

        if (wives.error)
            throw wives.error;

        const backup = {

            version: "3.0",

            created_at:

                new Date().toISOString(),

            personnel:

                personnel.data,

            commanders:

                commanders.data,

            wives:

                wives.data

        };

        const blob = new Blob(

            [

                JSON.stringify(

                    backup,

                    null,

                    2

                )

            ],

            {

                type: "application/json"

            }

        );

        const url =
            URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;

        a.download =
            "Backup_"

            +

            new Date()

                .toISOString()

                .substring(0,10)

            +

            ".json";

        document.body.appendChild(a);

        a.click();

        a.remove();

        URL.revokeObjectURL(url);

        showSuccess(

            "สำรองข้อมูลเรียบร้อย"

        );

    }

    catch(err){

        showError(err);

    }

    finally{

        hideLoading(btn);

    }

}

// ==============================================
// RESTORE
// ==============================================

async function restoreBackup(event){

    const file =
        event.target.files[0];

    if(!file)
        return;

    if(

        !confirm(

            "ยืนยัน Restore ?"

        )

    ){

        event.target.value="";

        return;

    }

    const btn =
        document.getElementById("btnRestore");

    try{

        showLoading(

            btn,

            "กำลังกู้คืน..."

        );

        const text =
            await file.text();

        const json =
            JSON.parse(text);

        if(

            !json.version ||

            !json.personnel

        ){

            throw new Error(

                "ไฟล์ Backup ไม่ถูกต้อง"

            );

        }

        // ==========================
        // ล้างข้อมูลเดิม
        // ==========================

        await supabase
            .from("wives")
            .delete()
            .neq("id",0);

        await supabase
            .from("commanders")
            .delete()
            .neq("id",0);

        await supabase
            .from("personnel")
            .delete()
            .neq("id",0);

        // ==========================
        // Restore
        // ==========================

        if(json.personnel.length){

            const {error}=

            await supabase

            .from("personnel")

            .insert(

                json.personnel

            );

            if(error)
                throw error;

        }

        if(json.commanders.length){

            const {error}=

            await supabase

            .from("commanders")

            .insert(

                json.commanders

            );

            if(error)
                throw error;

        }

        if(json.wives.length){

            const {error}=

            await supabase

            .from("wives")

            .insert(

                json.wives

            );

            if(error)
                throw error;

        }

        showSuccess(

            "Restore สำเร็จ"

        );

        location.reload();

    }

    catch(err){

        showError(err);

    }

    finally{

        hideLoading(btn);

    }

}
