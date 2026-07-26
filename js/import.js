async function importExcel(){

const file=document.getElementById("excelFile").files[0];

if(!file){

alert("เลือกไฟล์ก่อน");

return;

}

const reader=new FileReader();

reader.onload=async(e)=>{

const workbook=XLSX.read(e.target.result,{type:"binary"});

const sheet=workbook.Sheets[workbook.SheetNames[0]];

const rows=XLSX.utils.sheet_to_json(sheet);

for(const r of rows){

await save(r);

}

document.getElementById("status").innerHTML=

"นำเข้าข้อมูลเรียบร้อย";

};

reader.readAsBinaryString(file);

}

async function save(r){

await fetch(

`${SUPABASE_URL}/rest/v1/personnel`,

{

method:"POST",

headers:{

apikey:SUPABASE_KEY,

Authorization:"Bearer "+SUPABASE_KEY,

"Content-Type":"application/json",

Prefer:"return=minimal"

},

body:JSON.stringify({

rank:r["ยศ"],

firstname:r["ชื่อ"],

lastname:r["สกุล"],

nickname:r["ชื่อเล่น"],

position:r["ตำแหน่ง"],

class:r["ตท."],

phone:r["โทรศัพท์"],

remark:r["หมายเหตุ"]

})

}

);

}

