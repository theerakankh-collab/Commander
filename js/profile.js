// ==============================================
// profile.js
// Military Directory
// Personnel Profile
// Version 3.0
// ==============================================

"use strict";

let personnelId = null;

// ==============================================

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        personnelId =

            Number(

                new URLSearchParams(

                    window.location.search

                ).get("id")

            );

        if (

            !personnelId ||

            isNaN(personnelId)

        ) {

            alert("ไม่พบรหัสกำลังพล");

            location.href =

                "dashboard.html";

            return;

        }

        await loadPersonnel();

    }

);

// ==============================================

async function loadPersonnel() {

    try {

        const {

            data,

            error

        } = await supabase

            .from("personnel")

            .select("*")

            .eq("id", personnelId)

            .single();

        if (error)

            throw error;

        renderProfile(data);

    }

    catch (err) {

        showError(err);

    }

}

// ==============================================

function renderProfile(data) {

    document.getElementById(

        "fullname"

    ).textContent =

        `${data.rank || ""} ${data.firstname || ""} ${data.lastname || ""}`;

    setText(

        "rank",

        data.rank

    );

    setText(

        "firstname",

        data.firstname

    );

    setText(

        "lastname",

        data.lastname

    );

    setText(

        "position",

        data.position

    );

    setText(

        "nickname",

        data.nickname

    );

    setText(

        "class_name",

        data.class

    );

    setText(

        "phone",

        data.phone

    );

    setText(

        "remark",

        data.remark

    );

    loadImage(

        data.image

    );

}

// ==============================================

function loadImage(image) {

    const img =

        document.getElementById(

            "photo"

        );

    if (!img)

        return;

    if (

        image &&

        image.trim() !== ""

    ) {

        img.src = image;

    }

    else {

        img.src =

            "images/no-photo.png";

    }

}

// ==============================================

function setText(id, value) {

    const obj =

        document.getElementById(id);

    if (!obj)

        return;

    obj.textContent =

        value || "-";

}

// ==============================================

function refresh() {

    loadPersonnel();

}

// ==============================================

function backDashboard() {

    location.href =

        "dashboard.html";

}
