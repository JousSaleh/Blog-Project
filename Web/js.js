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


const openCreatePost = document.getElementById("openCreatePost");
const createPostModal = document.getElementById("createPostModal");
const closeCreatePost = document.getElementById("closeCreatePost");


// Open Modal

openCreatePost.addEventListener("click", () => {

    createPostModal.classList.add("active");

});


// Close Modal

closeCreatePost.addEventListener("click", () => {

    createPostModal.classList.remove("active");

});


// Close when clicking outside the box

createPostModal.addEventListener("click", (event) => {

    if (event.target === createPostModal) {

        createPostModal.classList.remove("active");

    }

});




const postForm = document.getElementById("postForm");

postForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const formData = new FormData(postForm);

    try {

        const response = await fetch("/api/posts", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error);
            return;
        }

        alert("Post created successfully!");

        postForm.reset();

        createPostModal.classList.remove("active");

        loadPosts();

    } catch (error) {

        console.error(error);
        alert("Something went wrong");

    }

});





const postsContainer = document.getElementById("postsContainer");

async function loadPosts() {

    try {

        const response = await fetch("/api/posts");

        const posts = await response.json();

        if (!response.ok) {

            console.error(posts.error);

            return;
        }

        postsContainer.innerHTML = "";

        posts.forEach(post => {

            const postElement = document.createElement("div");

            postElement.classList.add("post");
            
            // =========================
            // Images
            // =========================

            const images = post.content_photos
                ? JSON.parse(post.content_photos)
                : [];


            const imagesHTML = images.map(image => {

                return `
                    <img
                        class="post-image"
                        src="${image}"
                        alt="Post image"
                    >
                `;

            }).join("");


             // =========================
            // Post HTML
            // =========================

            postElement.innerHTML = `

                <div class="post-user">

                    <img
                        src="${post.profile_image || "default-profile.png"}"
                        alt="Profile picture"
                    >

                    <span dir="auto">
                        ${post.username}
                    </span>

                </div>


                <h2 dir="auto">
                    ${post.title}
                </h2>


                <p dir="auto">
                    ${post.contents}
                </p>

                <div class="post-images">
                    ${imagesHTML}
                </div>

            `;


            postsContainer.appendChild(postElement);

        });

    } catch (error) {

        console.error("Error loading posts:", error);

    }

}






// =========================
// Image Modal
// =========================

const imageModal = document.getElementById("imageModal");
const expandedImage = document.getElementById("expandedImage");
const closeImageModal = document.getElementById("closeImageModal");


// فتح الصورة

document.addEventListener("click", function (event) {

    if (event.target.classList.contains("post-image")) {

        expandedImage.src = event.target.src;

        imageModal.classList.add("active");
    }

});


// إغلاق الصورة

imageModal.addEventListener("click", function (event) {

    // إذا ضغط على الخلفية أو X
    if (
        event.target === imageModal ||
        event.target === closeImageModal
    ) {

        imageModal.classList.remove("active");

        expandedImage.src = "";
    }

});













    // =========================
    // Check Login Status
    // =========================

    updateNavbar();
loadPosts();
