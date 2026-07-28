// ==============================================
// import.js
// Military Directory System
// Import Personnel Excel
// Version 3.0
// ==============================================

"use strict";

let excelRows = [];

// ==============================================

document.addEventListener(

    "DOMContentLoaded",

    () => {

        document

        .getElementById("excelFile")

        .addEventListener(

            "change",

            readExcel

        );

    }

);

// ==============================================
// อ่าน Excel
// ==============================================

function readExcel(event){

    const file=

    event.target.files[0];

    if(!file)

        return;

    const reader=

    new FileReader();

    reader.onload=function(e){

        const data=

        new Uint8Array(

            e.target.result

        );

        const workbook=

        XLSX.read(data,{

            type:"array"

        });

        const sheet=

        workbook.Sheets[

            workbook.SheetNames[0]

        ];

        excelRows=

        XLSX.utils.sheet_to_json(

            sheet,

            {

                defval:""

            }

        );

        previewData();

    };

    reader.readAsArrayBuffer(file);

}

// ==============================================
// Preview
// ==============================================

function previewData(){

    const tbody=

    document.getElementById(

        "preview"

    );

    tbody.innerHTML="";

    excelRows.forEach(

        row=>{

            tbody.innerHTML+=`

<tr>

<td>${row.rank||""}</td>

<td>

${row.firstname||""}

</td>

<td>

${row.lastname||""}

</td>

<td>

${row.position||""}

</td>

</tr>

`;

        }

    );

    document.getElementById(

        "totalRow"

    ).textContent=

    excelRows.length;

}

// ==============================================
// Import
// ==============================================

async function importData(){

    const btn=

    document.getElementById(

        "btnImport"

    );

    try{

        showLoading(

            btn,

            "กำลังนำเข้า..."

        );

        if(

            excelRows.length===0

        ){

            throw new Error(

                "ไม่มีข้อมูล"

            );

        }

        // Validation

        const validRows=[];

        for(

            const row

            of excelRows

        ){

            if(

                !row.rank||

                !row.firstname||

                !row.lastname

            ){

                continue;

            }

            validRows.push({

                rank:row.rank,

                firstname:row.firstname,

                lastname:row.lastname,

                nickname:row.nickname||"",

                position:row.position||"",

                class:row.class||"",

                phone:row.phone||"",

                remark:row.remark||"",

                image:null,

                created_at:

                new Date()

                .toISOString()

            });

        }

        if(

            validRows.length===0

        ){

            throw new Error(

                "ไม่มีข้อมูลที่ถูกต้อง"

            );

        }

        // Bulk Insert

        const{

            error

        }=

        await supabase

        .from("personnel")

        .insert(validRows);

        if(error)

            throw error;

        showSuccess(

            `นำเข้า ${validRows.length} รายการสำเร็จ`

        );

        location.href=

        "dashboard.html";

    }

    catch(err){

        showError(err);

    }

    finally{

        hideLoading(btn);

    }

}
