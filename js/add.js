async function save(){

const data={

rank:document.getElementById("rank").value,

firstname:document.getElementById("firstname").value,

lastname:document.getElementById("lastname").value,

position:document.getElementById("position").value,

nickname:document.getElementById("nickname").value,

class:document.getElementById("class").value,

phone:document.getElementById("phone").value,

remark:document.getElementById("remark").value

};

const r=await fetch(

`${SUPABASE_URL}/rest/v1/personnel`,

{

method:"POST",

headers:{

apikey:SUPABASE_KEY,

Authorization:"Bearer "+SUPABASE_KEY,

"Content-Type":"application/json",

Prefer:"return=representation"

},

body:JSON.stringify(data)

}

);

if(r.ok){

alert("บันทึกข้อมูลเรียบร้อย");

location.href="dashboard.html";

}else{

alert("เกิดข้อผิดพลาด");

}

}
