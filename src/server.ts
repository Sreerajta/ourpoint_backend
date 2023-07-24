import express from "express";
import passport from "passport";
import session from "express-session";
import { Strategy as LocalStrategy } from "passport-local";


// Replace the below with your actual user model and authentication logic,once implemented
const fakeUser = {
    id: 1,
    username: "testuser",
    password: "testpassword",
  };
  
  passport.use(
    new LocalStrategy((username, password, done) => {
      if (username === fakeUser.username && password === fakeUser.password) {
        return done(null, fakeUser);
      } else {
        return done(null, false);
      }
    })
  );
  
  passport.serializeUser((user:any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    if (id === fakeUser.id) {
      done(null, fakeUser);
    } else {
      done(new Error("User not found"));
    }
  });

const app = express();
const port = 3000;

// Add the express-session middleware
app.use(session({
    secret: "hnj6546h4k7$6436kngdf6342$^#@$",
    resave: false,
    saveUninitialized: false,
  }));
  

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Hello, TypeScript Express.js!");
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err:any, user:any, info:any) => {
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


app.post('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });


  function ensureAuthenticated(req:any, res:any, next:any) {
    if (req.isAuthenticated()) {
      return next();
    }
    // res.redirect("/login");
    res.send("Please Login")
  }
  
  // Example protected route
  app.get("/dashboard", ensureAuthenticated, (req, res) => {
    res.send("Welcome to the dashboard!");
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});