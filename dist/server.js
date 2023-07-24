"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const passport_local_1 = require("passport-local");
// Replace the below with your actual user model and authentication logic,once implemented
const fakeUser = {
    id: 1,
    username: "testuser",
    password: "testpassword",
};
passport_1.default.use(new passport_local_1.Strategy((username, password, done) => {
    if (username === fakeUser.username && password === fakeUser.password) {
        return done(null, fakeUser);
    }
    else {
        return done(null, false);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => {
    if (id === fakeUser.id) {
        done(null, fakeUser);
    }
    else {
        done(new Error("User not found"));
    }
});
const app = (0, express_1.default)();
const port = 3000;
// Add the express-session middleware
app.use((0, express_session_1.default)({
    secret: "hnj6546h4k7$6436kngdf6342$^#@$",
    resave: false,
    saveUninitialized: false,
}));
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.get("/", (req, res) => {
    res.send("Hello, TypeScript Express.js!");
});
app.post("/login", (req, res, next) => {
    passport_1.default.authenticate("local", (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }
        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ message: "Internal Server Error" });
            }
            return res.status(200).json({ message: "Authentication successful" });
        });
    })(req, res, next);
});
app.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // res.redirect("/login");
    res.send("Please Login");
}
// Example protected route
app.get("/dashboard", ensureAuthenticated, (req, res) => {
    res.send("Welcome to the dashboard!");
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
