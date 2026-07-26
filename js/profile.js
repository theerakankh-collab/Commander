const id =
new URLSearchParams(location.search).get("id");

load();

async function load(){

const r = await fetch(

`${SUPABASE_URL}/rest/v1/personnel?id=eq.${id}&select=*`,

{

headers:{

apikey:SUPABASE_KEY,

Authorization:"Bearer "+SUPABASE_KEY

}

}

);

const d = await r.json();

const p = d[0];

document.getElementById("fullname").innerHTML =
p.firstname + " " + p.lastname;

document.getElementById("rank").innerHTML =
p.rank;

document.getElementById("position").innerHTML =
p.position;

document.getElementById("nickname").innerHTML =
p.nickname;

document.getElementById("class").innerHTML =
p.class;

document.getElementById("phone").innerHTML =
p.phone;

document.getElementById("remark").innerHTML =
p.remark;

}

