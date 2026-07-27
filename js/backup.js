async function backupDatabase(){

const {data,error}=

await supabase

.from("personnel")

.select("*");

if(error){

alert(error.message);

return;

}

const blob=

new Blob(

[JSON.stringify(data,null,2)],

{

type:"application/json"

}

);

const a=document.createElement("a");

a.href=

URL.createObjectURL(blob);

a.download="backup.json";

a.click();

}
