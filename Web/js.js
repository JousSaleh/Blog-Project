document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // Navbar
    // =========================

    const navbarToggle =
        document.getElementById("navbarToggle");

    const navbarMenu =
        document.getElementById("navbarMenu");


    if (navbarToggle && navbarMenu) {

        navbarToggle.addEventListener("click", function () {

            navbarToggle.classList.toggle("is-active");

            navbarMenu.classList.toggle("is-active");

            const isExpanded =
                navbarToggle.getAttribute("aria-expanded") === "true";

            navbarToggle.setAttribute(
                "aria-expanded",
                !isExpanded
            );

        });

    }


    // =========================
    // Login Modal
    // =========================

    const loginModal =
        document.getElementById("loginModal");

    const openBtnLogin =
        document.getElementById("openModalLogin");

    const closeBtnLogin =
        document.getElementById("closeModalLogin");


    // =========================
    // Register Modal
    // =========================

    const registerModal =
        document.getElementById("registerModal");

    const openBtnCreateAccount =
        document.getElementById("newAccount");

    const closeBtnRegister =
        document.getElementById("closeModalRegister");


    // Open Login
    if (openBtnLogin && loginModal) {

        openBtnLogin.addEventListener("click", function (e) {

            e.preventDefault();

            loginModal.classList.add("active");

        });

    }


    // Close Login
    if (closeBtnLogin && loginModal) {

        closeBtnLogin.addEventListener("click", function () {

            loginModal.classList.remove("active");

        });

    }


    // Open Register
    if (openBtnCreateAccount && registerModal) {

        openBtnCreateAccount.addEventListener("click", function () {

            if (loginModal) {
                loginModal.classList.remove("active");
            }

            registerModal.classList.add("active");

        });

    }


    // Close Register
    if (closeBtnRegister && registerModal) {

        closeBtnRegister.addEventListener("click", function () {

            registerModal.classList.remove("active");

        });

    }


    // Close Login by clicking outside
    if (loginModal) {

        loginModal.addEventListener("click", function (event) {

            if (event.target === loginModal) {

                loginModal.classList.remove("active");

            }

        });

    }


    // Close Register by clicking outside
    if (registerModal) {

        registerModal.addEventListener("click", function (event) {

            if (event.target === registerModal) {

                registerModal.classList.remove("active");

            }

        });

    }


    // ESC
    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            if (loginModal) {
                loginModal.classList.remove("active");
            }

            if (registerModal) {
                registerModal.classList.remove("active");
            }

        }

    });


    // =========================
    // Register Form
    // =========================

    const registerForm =
        document.getElementById("registerForm");


    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const Username =
                    document.getElementById("Username").value;

                const firstName =
                    document.getElementById("firstName").value;

                const secondName =
                    document.getElementById("secondName").value;

                const Age =
                    document.getElementById("Age").value;

                const email =
                    document.getElementById("email").value;

                const password =
                    document.getElementById("password").value;


                // Gender
                const genderInput =
                    document.querySelector(
                        'input[name="Gender"]:checked'
                    );

                const Gender =
                    genderInput
                        ? genderInput.value
                        : "";


                // Data sent to Node.js
                const data = {
                    Username,
                    firstName,
                    secondName,
                    Age,
                    email,
                    password,
                    Gender,
                    Profile_image: null
                };


                console.log("Data sent:", data);


                try {

                    const response = await fetch(
                        "/register",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify(data)
                        }
                    );


                    const result =
                        await response.json();


                    const message =
                        document.getElementById("message");


                    if (message) {

                        message.textContent =
                            result.message;

                    }


                    if (response.ok) {

                        registerForm.reset();

                        setTimeout(() => {

                            if (registerModal) {

                                registerModal.classList.remove(
                                    "active"
                                );

                            }

                        }, 1500);

                    }


                } catch (error) {

                    console.error(error);

                    const message =
                        document.getElementById("message");


                    if (message) {

                        message.textContent =
                            "Something went wrong";

                    }

                }

            }
        );

    }

});



// =========================
// Login Form
// =========================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const username =
                document.getElementById("UsernameL").value;

            const password =
                document.getElementById("PasswordL").value;


            const data = {
                username,
                password
            };


            try {

                const response = await fetch(
                    "/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(data)
                    }
                );


                const result =
                    await response.json();


                const message =
                    document.getElementById("loginMessage");


                if (message) {

                    message.textContent =
                        result.message;

                }


              if (response.ok) {

    console.log("Login successful");

    // إغلاق مودال Login
    if (loginModal) {
        loginModal.classList.remove("active");
    }

    // تنظيف الفورم
    loginForm.reset();

    // تغيير Login إلى Logout مباشرة
    const loginButton =
        document.getElementById("openModalLogin");

    const logoutButton =
        document.getElementById("logoutButton");

    if (loginButton) {
        loginButton.style.display = "none";
    }

    if (logoutButton) {
        logoutButton.style.display = "inline-block";
    }

}

            } catch (error) {

                console.error(error);

                const message =
                    document.getElementById("loginMessage");

                if (message) {

                    message.textContent =
                        "Something went wrong";

                }

            }

        }
    );

}

// =========================
    // Update Navbar
    // =========================

    async function updateNavbar() {

        const loginButton =
            document.getElementById("openModalLogin");

        const logoutButton =
            document.getElementById("logoutButton");


        if (!loginButton || !logoutButton) {
            return;
        }


        try {

            const response =
                await fetch("/me");


            const result =
                await response.json();


            if (result.loggedIn) {

                // User is logged in

                loginButton.style.display = "none";

                logoutButton.style.display =
                    "inline-block";

            } else {

                // User is NOT logged in

                loginButton.style.display =
                    "inline-block";

                logoutButton.style.display =
                    "none";

            }

        } catch (error) {

            console.error(
                "Error checking login status:",
                error
            );

        }

    }


    // =========================
    // Logout
    // =========================

  const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener("click", async function () {

        try {

            const response = await fetch("/logout", {
                method: "POST"
            });

            const result = await response.json();

            console.log(result.message);

            if (response.ok) {

                // إظهار Login
                const loginButton =
                    document.getElementById("openModalLogin");

                if (loginButton) {
                    loginButton.style.display = "inline-block";
                }

                // إخفاء Logout
                logoutButton.style.display = "none";

                // إذا تبغين يرجع للصفحة الرئيسية
                window.location.href = "Main.html";
            }

        } catch (error) {

            console.error("Logout error:", error);

        }

    });

}


    // =========================
    // Check Login Status
    // =========================

    updateNavbar();

