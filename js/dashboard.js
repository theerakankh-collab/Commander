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
