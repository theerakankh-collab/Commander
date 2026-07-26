document
.getElementById("loginBtn")
.addEventListener("click", login);

async function login(){

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

const {error} =
await supabase.auth.signInWithPassword({

email,

password

});

if(error){

document.getElementById("msg").innerHTML=
error.message;

return;

}

location.href="dashboard.html";

}
