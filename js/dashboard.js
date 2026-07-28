// ==============================================
// dashboard.js
// Military Directory
// Dashboard
// ==============================================

"use strict";

let personnel = [];

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        await initialize();

    }

);

// =====================================

async function initialize(){

    try{

        await checkLogin();

        await Promise.all([

            loadSummary(),

            loadPersonnel()

        ]);

    }

    catch(err){

        showError(err);

    }

}

// =====================================

async function loadSummary(){

    try{

        const [

            personnelResult,

            commanderResult,

            wifeResult

        ] = await Promise.all([

            supabase

            .from("personnel")

            .select("*",{

                count:"exact",

                head:true

            }),

            supabase

            .from("commanders")

            .select("*",{

                count:"exact",

                head:true

            }),

            supabase

            .from("wives")

            .select("*",{

                count:"exact",

                head:true

            })

        ]);

        document.getElementById(

            "totalPersonnel"

        ).textContent=

        personnelResult.count||0;

        document.getElementById(

            "totalCommander"

        ).textContent=

        commanderResult.count||0;

        document.getElementById(

            "totalWife"

        ).textContent=

        wifeResult.count||0;

    }

    catch(err){

        console.error(err);

    }

}

// =====================================

async function loadPersonnel(){

    try{

        const {

            data,

            error

        } = await supabase

        .from("personnel")

        .select("*")

        .order("lastname")

        .order("firstname");

        if(error)

            throw error;

        personnel=data||[];

        renderTable(personnel);

        const phoneCount=

        personnel.filter(

            p=>p.phone

        ).length;

        document.getElementById(

            "totalPhone"

        ).textContent=

        phoneCount;

    }

    catch(err){

        showError(err);

    }

}

// =====================================

function renderTable(rows){

    const tbody=

    document.getElementById(

        "result"

    );

    if(rows.length===0){

        tbody.innerHTML=`

        <tr>

        <td colspan="5"

        class="text-center">

        ไม่พบข้อมูล

        </td>

        </tr>

        `;

        return;

    }

    tbody.innerHTML=

    rows.map(p=>`

<tr>

<td>${p.rank??""}</td>

<td>

${p.firstname??""}

${p.lastname??""}

</td>

<td>${p.position??""}</td>

<td>${p.phone||"-"}</td>

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

`).join("");

initializeTable();

}

// =====================================

function initializeTable(){

    if(

        $.fn.DataTable.isDataTable(

            "#personTable"

        )

    ){

        $("#personTable")

        .DataTable()

        .destroy();

    }

    const table=

    $("#personTable")

    .DataTable({

        pageLength:20,

        responsive:true,

        language:{

url:

"https://cdn.datatables.net/plug-ins/1.13.8/i18n/th.json"

        }

    });

    $("#search")

    .off()

    .keyup(function(){

        table.search(

            this.value

        ).draw();

    });

}

// =====================================

async function deletePersonnel(id){

    if(

        !confirm(

            "ยืนยันการลบข้อมูล?"

        )

    )

    return;

    try{

        const{

            error

        }=await supabase

        .from("personnel")

        .delete()

        .eq("id",id);

        if(error)

            throw error;

        showSuccess(

            "ลบข้อมูลเรียบร้อย"

        );

        await initialize();

    }

    catch(err){

        showError(err);

    }

}

// =====================================

function refresh(){

    initialize();

}
