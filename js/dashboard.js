async function count(table){

const r=await fetch(

`${SUPABASE_URL}/rest/v1/${table}?select=*`,

{

headers:{

apikey:SUPABASE_KEY,

Authorization:"Bearer "+SUPABASE_KEY

}

}

);

const d=await r.json();

return d.length;

}

async function load(){

document.getElementById("totalPersonnel").innerHTML=
await count("personnel");

document.getElementById("totalCommander").innerHTML=
await count("commanders");

document.getElementById("totalWife").innerHTML=
await count("wives");

}

load();

let personnel=[];

async function loadPersonnel(){

const res=await fetch(

`${SUPABASE_URL}/rest/v1/personnel?select=*`,

{

headers:{

apikey:SUPABASE_KEY,

Authorization:"Bearer "+SUPABASE_KEY

}

}

);

personnel=await res.json();

show(personnel);

document.getElementById("totalPhone").innerHTML=

personnel.filter(x=>x.phone!="").length;

}

function show(data){

let html="";

data.forEach(x=>{

html+=`

<tr>

<td>${x.rank}</td>

<td>${x.firstname} ${x.lastname}</td>

<td>${x.position}</td>

<td>${x.phone}</td>

</tr>

`;

});

document.getElementById("result").innerHTML=html;

}

document

.getElementById("search")

.addEventListener("keyup",(e)=>{

let k=e.target.value.toLowerCase();

show(

personnel.filter(x=>

JSON.stringify(x)

.toLowerCase()

.includes(k)

)

);

});

loadPersonnel();

function show(data){

let html="";

data.forEach(p=>{

html+=`

<tr>

<td>${p.rank}</td>

<td>${p.firstname} ${p.lastname}</td>

<td>${p.position}</td>

<td>${p.phone}</td>

<td>

<button

class="btn btn-success btn-sm"

onclick="view(${p.id})">

รายละเอียด

</button>

</td>

</tr>

`;

});

$("#result").html(html);

if($.fn.DataTable.isDataTable("#personTable")){

$("#personTable").DataTable().destroy();

}

$("#personTable").DataTable({

pageLength:20,

responsive:true,

language:{

url:"https://cdn.datatables.net/plug-ins/1.13.8/i18n/th.json"

}

});

}

function view(id){

window.location.href=

"profile.html?id="+id;

}
