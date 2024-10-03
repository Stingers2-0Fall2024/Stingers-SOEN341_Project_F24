const express = require("express");
const app = express();
const path = require("path");
const jwt = require('jsonwebtoken');
const session = require("express-session")
const cookies = require("cookie-parser");
const sequelize = require('./config/database');  //Ali - Database connection
const authRoutes = require('./routes/autroutes'); //Ali - Authentication routes
const authService = require("./services/autservices"); //Samuel - Services used to log in
const cookieParser = require("cookie-parser");
require('dotenv').config(); // Ali - Loads environment variables

app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SECRET_KEY, // This should be stored securely in an environment variable
    resave: false,
    saveUninitialized: true,
    maxAge: 360000
  })
);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//This get method is defined for all routes. 
//Every time someone enters the website
//they need to login first no matter the path
app.get("*", (req,res,next)=>{
  console.log(req.url)
  if (req.url == "/register"){
    next();
  }
  let username = req.session.token;
  if (username) {
    // Redirect to normal website content 
    next();
  } else {
    // LogIn page
    res.cookie("path", req.url);
    res.render("login");
  }
})

//Send home page as defaut
app.get("/", (req, res) => {
    res.render("home", {username: (jwt.verify(req.session.token, process.env.JWT_SECRET)).name}) // Modify as needed
});

//Send the register html page to the user
app.get("/register", (req, res) =>{
  res.render("register");
})

//Takes the register form and sends it to the database
//Then, logs in the user.
app.post("/register", async (req,res)=>{
  let email = req.body.email;
  let password = req.body.password;
  let role = req.body.role;
  let Id = req.body.Id;
  let name = req.body.name;
  console.log(req.body.email)
  try {
    const result = await authService.registerUser(email, password, role, Id, name);

    req.session.token = result;

    let user = jwt.verify(req.session.token, process.env.JWT_SECRET)

    res.render("loggedIn", {user: user.name});
  } catch (error) {

    res.status(401).send(error.message);
  }
})


//Takes the login form and compare the email and password to the database
//Then, it logs in the user and send him back to the url he requested
app.post("/login", async (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;

  try {
    const result = await authService.loginUser(email, password);

    req.session.token = result;

    let user = jwt.verify(req.session.token, process.env.JWT_SECRET)

    res.redirect(req.cookies.path);
  } catch (error) {

    res.status(401).send(error.message);
  }
});

app.get("/logout", (req,res, next)=>{

  req.session.destroy();
  next();
})


//Send back the dashboard html page
app.get("/dashboard", (req,res)=>{
  res.sendFile(path.join(__dirname,"/views/teacher_cabinet.html"));
})

//
app.post("/dashboard", (req,res)=>{
  console.log(req.body);
  console.log(req.body.teams);
  res.send(req.body);
})


//Following was added by Ali

// Loads authentication routes (login and registration)
app.use('/api/auth', authRoutes);

// Syncs the database
sequelize.sync()
  .then(() => {
    console.log('Connected to the Database');
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
  });

// Modified by Ali ( so that it is more flexible for environment variables) 
//Starts the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
