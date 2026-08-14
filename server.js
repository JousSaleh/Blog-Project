const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const pool = require("./databasepg");
const session = require("express-session");

const app = express();

app.use(express.json());

app.use(
    session({
        secret: "my-blog-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false
        }
    })
);

// =========================
// Open Main.html
// =========================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Web", "Main.html"));
});

app.get("/Main.html", (req, res) => {
    res.sendFile(path.join(__dirname, "Web", "Main.html"));
});


// =========================
// Static files
// CSS / JS / Images
// =========================

app.use(express.static(path.join(__dirname, "Web")));


// =========================
// Register
// =========================

app.post("/register", async (req, res) => {

    try {

        const {
            Username,
            firstName,
            secondName,
            Age,
            email,
            password,
            Gender,
            Profile_image
        } = req.body;


        console.log("Password:", password);
        console.log("Password type:", typeof password);


        // Check required fields
        if (
            !Username ||
            !firstName ||
            !secondName ||
            !Age ||
            !email ||
            !password ||
            !Gender
        ) {

            return res.status(400).json({
                message: "Please fill in all required fields"
            });

        }


        // Check if email already exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );


        if (existingUser.rows.length > 0) {

            return res.status(400).json({
                message: "Email already exists"
            });

        }


        // Hash password
        const hashedPassword = await bcrypt.hash(
            String(password),
            10
        );


        // Profile image is optional
        const profileImage = Profile_image || null;


        // Insert user
        await pool.query(
            `INSERT INTO users
            (username, firstname, secondname, age, email, password, gender, profile_image)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                Username,
                firstName,
                secondName,
                Age,
                email,
                hashedPassword,
                Gender,
                profileImage
            ]
        );


        res.status(201).json({
            message: "Account created successfully"
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});






// =========================
// Login
// =========================

app.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;
 

        // Check required fields
        if (!username || !password) {
            return res.status(400).json({
                message: "Please enter username and password"
            });
        }

        // Find user by email
        const result = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        // User not found
        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const user = result.rows[0];

        // Compare entered password with hashed password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        // Password incorrect
       if (!passwordMatch) {
    return res.status(401).json({
        message: "Invalid username or password"
    });
}


// Save logged-in user in session
req.session.user = {
    user_id: user.user_id,
    username: user.username,
    firstname: user.firstname,
    secondname: user.secondname,
    email: user.email
};


res.status(200).json({
    message: "Login successful"
});

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});






app.post("/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            console.error(error);

            return res.status(500).json({
                message: "Logout failed"
            });

        }

        res.clearCookie("connect.sid");

        res.json({
            message: "Logout successful"
        });

    });

});


app.get("/me", (req, res) => {

    if (req.session.user) {

        return res.json({
            loggedIn: true,
            user: req.session.user
        });

    }

    res.json({
        loggedIn: false
    });

});










// =========================
// Start server
// =========================

const PORT = 3000;

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});