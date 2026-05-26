// Smart Back Button Logic
// Works for auth pages and settings sub-pages

const backBtn = document.querySelector(".smart-back");

if (backBtn) {

    backBtn.addEventListener("click", () => {

        // Read URL parameters
        const params = new URLSearchParams(window.location.search);

        // Get source page
        const from = params.get("from");

        switch (from) {

            case "register":
                window.location.href = "../register.html";
                break;

            case "login":
                window.location.href = "../login.html";
                break;

            default:
                window.location.href = "../settings.html";
        }

    });

}