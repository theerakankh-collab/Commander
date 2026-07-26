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
