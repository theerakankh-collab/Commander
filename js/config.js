// ======================================================
// config.js
// Military Directory System
// Supabase Configuration
// Version 2.1
// ======================================================


"use strict";


// ======================================================
// SUPABASE CONFIGURATION
// ======================================================

const SUPABASE_URL =
"https://sftbzmwrrymlgbsmuima.supabase.co";


const SUPABASE_ANON_KEY =
"sb_publishable_J3UrucI0x66JEbHUQQHlXA_QFQf-ioz";




// ======================================================
// CHECK SUPABASE LIBRARY
// ======================================================


if(typeof window.supabase === "undefined"){


    console.error(
        "Supabase JS Library not loaded"
    );


    alert(
        "ไม่พบ Supabase Library"
    );


    throw new Error(
        "Supabase Library Missing"
    );

}




// ======================================================
// CREATE SUPABASE CLIENT
// ======================================================


const supabaseClient =
window.supabase.createClient(

    SUPABASE_URL,

    SUPABASE_ANON_KEY,

    {

        auth:{


            autoRefreshToken:true,


            persistSession:true,


            detectSessionInUrl:true


        }

    }

);




// ======================================================
// GLOBAL EXPORT
// ======================================================


window.supabaseClient =
supabaseClient;




// ======================================================
// DEBUG
// ======================================================


console.log(
"===================================="
);


console.log(
"Military Directory System"
);


console.log(
"Supabase Connected"
);


console.log(
SUPABASE_URL
);


console.log(
"Client:",
supabaseClient
);


console.log(
"===================================="
);





// ======================================================
// LOADING BUTTON
// ======================================================


function showLoading(

    button,

    text="กำลังดำเนินการ..."

){


    if(!button)
        return;



    button.disabled=true;



    button.dataset.oldText =
    button.innerHTML;



    button.innerHTML =
    text;


}





function hideLoading(button){


    if(!button)
        return;



    button.disabled=false;



    button.innerHTML =

    button.dataset.oldText

    ||

    "บันทึก";


}





// ======================================================
// ALERT MESSAGE
// ======================================================


function showSuccess(message){


    alert(

        message

    );


}




function showError(error){


    console.error(
        error
    );


    alert(

        error?.message

        ||

        error

        ||

        "เกิดข้อผิดพลาด"

    );


}






// ======================================================
// AUTH FUNCTIONS
// ======================================================



async function getCurrentUser(){


    try{


        const {

            data,

            error

        } =

        await supabaseClient
        .auth
        .getUser();



        if(error){


            console.error(error);


            return null;

        }



        return data.user;



    }

    catch(err){


        console.error(err);


        return null;


    }


}







async function getSession(){


    try{


        const {

            data,

            error

        } =

        await supabaseClient
        .auth
        .getSession();



        if(error){


            console.error(error);


            return null;


        }



        return data.session;



    }

    catch(err){


        console.error(err);


        return null;


    }



}







// ======================================================
// REQUIRE LOGIN
// ======================================================


async function requireLogin(){



    const session =

    await getSession();




    if(!session){



        window.location.replace(

            "login.html"

        );


        return false;


    }



    return true;


}







// ======================================================
// LOGOUT
// ======================================================


async function logout(){



    const confirmLogout =

    confirm(

        "ต้องการออกจากระบบใช่หรือไม่ ?"

    );




    if(!confirmLogout)

        return;





    const {

        error

    } =

    await supabaseClient
    .auth
    .signOut();





    if(error){



        showError(error);


        return;


    }






    localStorage.clear();


    sessionStorage.clear();




    window.location.replace(

        "login.html"

    );




}








// ======================================================
// PAGE AUTH CHECK
// ======================================================



document.addEventListener(

"DOMContentLoaded",

async function(){



    const authRequired =

    document.body.dataset.auth;



    if(authRequired==="required"){



        await requireLogin();


    }



});







// ======================================================
// TEST CONNECTION
// ======================================================


async function testSupabase(){



    const {

        data,

        error

    } =

    await supabaseClient
    .from("personnel")
    .select("id")
    .limit(1);





    if(error){



        console.error(
            "Database Error:",
            error
        );


        return false;


    }





    console.log(

        "Database OK",

        data

    );



    return true;


}
