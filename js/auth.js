async function checkLogin(){

const {

data:{session}

}=await supabase.auth.getSession();

if(!session){

location.href="login.html";

}

}
