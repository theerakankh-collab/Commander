async function checkLogin(){

const {

data:{session}

}=await supabase.auth.getSession();

if(!session){

location.href="login.html";

}

}
async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    alert(error.message);
    return;
  }

  window.location.href = "login.html";
}
